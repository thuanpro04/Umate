const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const url = "https://tdmu.edu.vn/tin-tuc";
//npm install node-cron gọi event định kì
const { generateUniqueID } = require("../untils/informationUntils");
const { EventModel } = require("../models/eventModel");
const { MetaModel } = require("../models/metaModel");
const { UserModel } = require("../models/usersModel");
const { handleSendNotification } = require("./notificationServices");
const handlePostEvent = async (req, res) => {
  const data = req.body;
  const newEvent = new EventModel({
    postId: uuidv4(),
    userId: data.authorId,
    content: data.content,
    likes: 0,
    href: data.href,
  });
  await newEvent.save();
  return res.status(200).json({
    messages: "post event successfully !!",
    data: newEvent,
  });
};
const getEvents = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let previousHeight = 0;
  while (true) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await delay(2000);
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) {
      break;
    }
    previousHeight = currentHeight;
  }
  await page.waitForSelector(".tintuc815.for_count.new_item", {
    visible: true,
  });
  const scrapedData = await page.evaluate(() => {
    const articles = document.querySelectorAll(".tintuc815.for_count.new_item");
    return Array.from(articles).map((article) => {
      const titleElement = article.querySelector("h4.new_item_title a");
      const img = article.querySelector("img.new_item_img");
      const time = article.querySelector(".new_item_time");
      const content = article.querySelector(".new_item_desc");
      // const eventId = crypto.randomUUID();
      return {
        // eventId,
        title: titleElement ? titleElement.getAttribute("title").trim() : null,
        image: img ? img.src : null, // URL hình ảnh
        href: titleElement ? titleElement.getAttribute("href") : null,
        timestamp: time ? time.textContent.trim() : null, // Thời gian bài viết
        content: content ? content.textContent.trim() : null, // Nội dung tóm tắt
      };
    });
  });
  await browser.close();
  //const newEvent = [];

  const scrapedTitles = scrapedData.map((e) => e.title);
  // console.log("Checking titles in DB:", scrapedTitles);

  const existingEvents = await EventModel.find({
    title: { $in: scrapedTitles },
  }).lean();

  const newEvents = scrapedData.filter(
    (event) => !existingEvents.includes(event.title)
  );
  //console.log("newEvents",newEvents, newEvents.length);
  // console.log("scrapedData", newEvents[0]);

  if (newEvents.length > 0) {
    await EventModel.insertMany(newEvents); // Thêm tất cả bài mới một lần
    console.log(`Đã lưu ${newEvents.length} bài viết mới.`);
  } else {
    console.log("Không có bài viết mới nào.");
  }
  return newEvents;
};

const handleGetEvent = async (req, res) => {
  const { curentPage, limit } = req.query;
  try {
    // const hasNewEvent = await checkForNewEvent();
    const eventPage = await getEvents();
    const now = new Date();
    await MetaModel.updateOne({}, { lastScrapeTime: now }, { upsert: true });
    const totalEvents = await EventModel.countDocuments();
    const events = await EventModel.find({})
      .skip((curentPage - 1) * limit)
      .limit(Number(limit));

    // handleSendNotification();

    res.status(200).json({
      message: "Get events successfully!",
      data: {
        events,
        totalPages: Math.ceil(eventPage.length / limit),
      },
    });
  } catch (error) {
    console.error("handle event fail error: ", error);
  }
};
const handleActionHeartForEvent = async (req, res) => {
  const { userId, eventId, key } = req.query;

  try {
    const event = await EventModel.findOne({ eventId });
    if (!event) {
      res.status(404).json({
        data: {
          messages: "Event not exist",
        },
      });
      console.log("event not exist");
    }
    if (!event.likes.includes(userId) && key === "add") {
      event.likes.push(userId);
      await event.save();
      res.status(200).json({
        data: {
          messages: "add heart for event successfully !!!",
        },
      });
      console.log("add heart for event successfully !!!");
    } else {
      event.likes = event.likes.filter((like) => like !== userId);
      await event.save();
      res.status(200).json({
        data: {
          messages: "Heart removed from event successfully!",
        },
      });
      console.log("Heart removed from event successfully!");
    }
  } catch (error) {
    console.log("handle add heart fail error: ", error);
  }
};
const handleShareEventMyApp = async (req, res) => {
  const data = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { userId: data.userId },
      {
        $addToSet: {
          eventShares: {
            eventId: data.userId,
            content: data.content,
            urlImage: data.urlImg,
            href: data.href,
          },
        },
      },
      { new: true } // Trả về tài liệu đã cập nhật
    );

    if (!updatedUser) {
      console.log(`Không tìm thấy người dùng với userId: ${userId}`);
      return null;
    }

    console.log("Người dùng đã được cập nhật:", updatedUser);
    res.status(200).json({
      message: "Share event successfully !!!!",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Share event error: ", error);
  }
};
const handleGetEventShared = async (req, res) => {
  const event = req.body;
  console.log(req.body);

  res.send("hello");
};
module.exports = {
  handlePostEvent,
  handleGetEvent,
  handleActionHeartForEvent,
  handleShareEventMyApp,
  handleGetEventShared,
};

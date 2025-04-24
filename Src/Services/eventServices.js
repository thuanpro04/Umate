const { v4: uuidv4 } = require("uuid");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const url = "https://tdmu.edu.vn/tin-tuc";
//npm install node-cron gọi event định kì
const { generateUniqueID } = require("../untils/informationUntils");
const { EventModel } = require("../models/eventModel");
const { UserModel } = require("../models/usersModel");
const { handleSendNotification } = require("./notificationServices");
const { formatUser } = require("./postServices");
const { PostModel } = require("../models/postModel");
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
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 8 * 60 * 1000;
const getEvents = async (forceRefresh) => {
  const currentTime = Date.now();
  if (
    forceRefresh &&
    cachedData &&
    currentTime - lastFetchTime < CACHE_DURATION
  ) {
    console.log("từ từ thoi");

    return cachedData;
  }
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

  if (scrapedData.length === 0) {
    console.log("Không có dữ liệu mới để kiểm tra.");
    return [];
  }
  const events = scrapedData.map((item) => ({
    id: generateUniqueID(),
    ...item,
  }));
  cachedData = events;
  lastFetchTime = currentTime;
  return events;
};

const handleGetEvent = async (req, res) => {
  const { curentPage, limit, forceRefresh } = req.query;
  try {
    console.log({ curentPage, limit, forceRefresh });

    // const hasNewEvent = await checkForNewEvent();
    const eventPage = await getEvents(forceRefresh === "true");
    // const totalEvents = await EventModel.countDocuments();
    // const events = await EventModel.find({})
    //   .skip((curentPage - 1) * limit)
    //   .limit(Number(limit));
    res.status(200).json({
      message: "Get events successfully!",
      data: {
        events: eventPage,
        totalPages: Math.ceil(eventPage.length / limit),
      },
    });
  } catch (error) {
    console.error("handle event fail error: ", error);
  }
};
const handleActionHeartForEvent = async (req, res) => {
  const { userId, id, key } = req.query;
  console.log({ userId, id, key });

  try {
    const event = await EventModel.findById(id);
    console.log(event);

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
      await UserModel.updateOne({ userId }, { $inc: { like: 1 } });
      res.status(200).json({
        data: {
          messages: "add heart for event successfully !!!",
          value: 1,
        },
      });
      console.log("add heart for event successfully !!!");
    } else {
      event.likes = event.likes.filter((like) => like !== userId);
      await event.save();
      await UserModel.updateOne({ userId }, { $inc: { like: -1 } });
      res.status(200).json({
        data: {
          messages: "Heart removed from event successfully!",
          value: -1,
        },
      });
      console.log("Heart removed from event successfully!");
    }
  } catch (error) {
    console.log("handle add heart fail error: ", error);
  }
};
const updateShareCountPost = async (postId) => {
  return await PostModel.findByIdAndUpdate(
    { postId },
    { $inc: { shareCount: 1 } }
  );
};
const handleShareEventMyApp = async (req, res) => {
  const data = req.body;

  try {
    // Ensure data matches the postSchema structure
    const postData = {
      postId: data.postId,
      url: data.url,
      userId: data.userId,
      content: data.content,
      title: data.title || "",
      images: data.images || [],
      privacy: data.privacy || "public",
      reactions: [],
      likeCount: data.likes,
      commentCount: data.comments,
      shareCount: data.shares,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: data.avatar,
      name: data.name,
    };
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { userId: data.currentId },
      {
        $addToSet: {
          eventShares: postData,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      console.log(`Không tìm thấy người dùng với userId: ${data.userId}`);
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log("Người dùng đã được cập nhật:", updatedUser.eventShares);
    await updateShareCountPost(data.postId);
    res.status(200).json({
      message: "Share event successfully !!!!",
      data: updatedUser.eventShares,
    });
  } catch (error) {
    console.log("Share event error: ", error);
    res.status(500).json({
      message: "An error occurred while sharing the event",
    });
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

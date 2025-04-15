const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function generateRepetitionDates(start, end, repetitions) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  const interval = Math.floor(totalDays / (repetitions - 1));

  const dates = [];
  for (let i = 0; i < repetitions; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i * interval);
    dates.push(date.toISOString().split("T")[0]); // Store as 'YYYY-MM-DD'
  }
  return dates;
}

const createRepetitionCalendar = async (req, res) => {
  const { chapterId, startDate, endDate, repetitions } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const dates = generateRepetitionDates(startDate, endDate, repetitions);

    const calendar = await prisma.repetitionCalendar.upsert({
      where: { chapterId },
      update: { dates, userId }, // in case user is re-creating for the same chapter
      create: {
        chapterId,
        dates,
        userId,
      },
    });

    res.status(201).json(calendar);
  } catch (error) {
    console.error("Error creating repetition calendar:", error.message);
    res.status(500).json({ error: "Failed to create repetition calendar" });
  }
};

const getAllRepetitionChapters = async (req, res) => {
  try {
    const userId = req.user?.id; // Assumes user is set via middleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const calendars = await prisma.repetitionCalendar.findMany({
      where: { userId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const result = calendars.map((calendar) => ({
      chapterId: calendar.chapter.id,
      chapterTitle: calendar.chapter.title,
      subjectId: calendar.chapter.subject.id,
      subjectName: calendar.chapter.subject.name,
      dates: calendar.dates,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching repetition calendar data:", error.message);
    res.status(500).json({ error: "Failed to retrieve calendar data" });
  }
};

module.exports = {
  createRepetitionCalendar,
  getAllRepetitionChapters,
};

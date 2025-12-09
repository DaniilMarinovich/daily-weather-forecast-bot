import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export async function initDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI not found inside .env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Подключено к MongoDB");
  } catch (e) {
    console.error("❌ Ошибка подключения к Mongo:", e);
    process.exit(1);
  }
}

export async function saveUser(chatId: number): Promise<void> {
  try {
    const newUser = new User({ chatId });
    await newUser.save();
    console.log(`User ${chatId} saved`);
  } catch (e: any) {
    if (e.code === 11000) {
      return;
    }
    console.error("Ошибка при сохранении:", e);
  }
}

export async function getUsers() {
  return await User.find().select("chatId");
}

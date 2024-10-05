"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice5, Send } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const foods = [
  { name: "チーズ", emoji: "🧀" },
  { name: "黒胡椒", emoji: "🌶" },
  { name: "バター", emoji: "🧈" },
  { name: "チリソース", emoji: "🌶" },
  { name: "マヨネーズ", emoji: "🥚" },
  { name: "バジル", emoji: "🌿" },
  { name: "レモン", emoji: "🍋" },
];

const dishes = [
  { name: "ラーメン", emoji: "🍜" },
  { name: "カレー", emoji: "🍛" },
  { name: "ピザ", emoji: "🍕" },
  { name: "寿司", emoji: "🍣" },
  { name: "ハンバーガー", emoji: "🍔" },
  { name: "パスタ", emoji: "🍝" },
  { name: "焼き鳥", emoji: "🍗" },
  { name: "タコス", emoji: "🌮" },
  { name: "天ぷら", emoji: "🍤" },
  { name: "グラタン", emoji: "🧀" },
  { name: "餃子", emoji: "🥟" },
  { name: "ステーキ", emoji: "🥩" },
  { name: "オムライス", emoji: "🍳" },
  { name: "親子丼", emoji: "🐔" },
];

type Food = {
  name: string;
  emoji: string;
};

export default function BuzzRecipeGenerator() {
  const [food1, setFood1] = useState<Food>(foods[0]);
  const [recipe2, setRecipe2] = useState<Food>(dishes[1]);
  const [recipe3, setRecipe3] = useState<Food>(dishes[2]);
  const [post, setPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const spinRoulette = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setFood1(foods[Math.floor(Math.random() * foods.length)]);
      setRecipe2(dishes[Math.floor(Math.random() * dishes.length)]);
      setRecipe3(dishes[Math.floor(Math.random() * dishes.length)]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const generatePost = async (
    food1: string,
    recipe2: string,
    recipe3: string
  ) => {
    const prompt = `あなたは料理研究科であり、インフルエンサーです。Xで140文字いないのバズるツイートを作成してください。${food1}と${recipe2}と${recipe3}を組み合わせて新しい料理を作ります。できる料理を想像して、思わず食べたくなるような美味しそうな表現をいれたXの投稿を作成してください。ハッシュタグはつけないでください。`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  };

  const handleGenerate = async () => {
    if (food1 && recipe2 && recipe3) {
      setIsGenerating(true);
      try {
        const generatedPost = await generatePost(
          food1.name,
          recipe2.name,
          recipe3.name
        );
        setPost(generatedPost);
      } catch (error) {
        console.error("Error generating post:", error);
        setPost("投稿の生成中にエラーが発生しました。");
      }
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    const tweetText = encodeURIComponent(`${post}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-center">
            バズグルメジェネレーター
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-center items-center space-x-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={food1.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl font-bold"
              >
                {food1.emoji}
              </motion.div>
            </AnimatePresence>
            <div className="text-2xl font-bold">×</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={recipe2.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl font-bold"
              >
                {recipe2.emoji}
              </motion.div>
            </AnimatePresence>
            <div className="text-2xl font-bold">×</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={recipe3.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-4xl font-bold"
              >
                {recipe3.emoji}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={food1.name + recipe2.name + recipe3.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl"
              >
                {food1.name} × {recipe2.name} × {recipe3.name}
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={spinRoulette}
            disabled={isSpinning || isGenerating}
            className="w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600 disabled:bg-blue-300"
          >
            <Dice5 className="w-4 h-4 inline-block mr-2" />
            {isSpinning ? "料理中..." : "バズレシピを生成"}
          </button>
          <button
            onClick={handleGenerate}
            disabled={
              !food1 || !recipe2 || !recipe3 || isGenerating || isSpinning
            }
            className="w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 disabled:bg-green-300"
          >
            <Send className="w-4 h-4 inline-block mr-2" />
            {isGenerating ? "生成中..." : "投稿文を生成"}
          </button>
          {post && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-100 rounded-md"
            >
              <p className="text-sm">{post}</p>
            </motion.div>
          )}
        </div>
        <div className="p-6 border-t">
          <button
            onClick={handleShare}
            disabled={!post}
            className="w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600 disabled:bg-blue-300"
          >
            Xに投稿
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dice5, Send } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

type Recipi = {
  name: string;
  emoji: string;
};

export default function BuzzRecipeGenerator() {
  const [recipe1, setRecipe1] = useState<Recipi>(dishes[0]);
  const [recipe2, setRecipe2] = useState<Recipi>(dishes[1]);
  const [post, setPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const spinRoulette = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setRecipe1(dishes[Math.floor(Math.random() * dishes.length)]);
      setRecipe2(dishes[Math.floor(Math.random() * dishes.length)]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const generatePost = async (recipe1: string, recipe2: string) => {
    const prompt = `Xで140文字いないのバズるツイートを作成してください。${recipe1}と${recipe2}を組み合わせて新しい料理を作ります。投稿をみたら思わず試してみたくなるような文章にしてください`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  };

  const handleGenerate = async () => {
    if (recipe1 && recipe2) {
      setIsGenerating(true);
      try {
        const generatedPost = await generatePost(recipe1.name, recipe2.name);
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
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-center">
          絶対1万リツイート超える君
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-center items-center space-x-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={recipe1.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-4xl font-bold"
              aria-label={`第一の料理: ${recipe1.name}`}
            >
              {recipe1.emoji}
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
              aria-label={`第二の料理: ${recipe2.name}`}
            >
              {recipe2.emoji}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={recipe1.name + recipe2.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl"
            >
              {recipe1.name} × {recipe2.name}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          onClick={spinRoulette}
          disabled={isSpinning || isGenerating}
          className="w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600 disabled:bg-blue-300"
          aria-label="レシピをスピンする"
        >
          <Dice5 className="w-4 h-4 inline-block mr-2" />
          {isSpinning ? "スピン中..." : "レシピをスピン"}
        </button>
        <button
          onClick={handleGenerate}
          disabled={!recipe1 || !recipe2 || isGenerating || isSpinning}
          className="w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 disabled:bg-green-300"
          aria-label="投稿文を生成する"
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
          aria-label="Xに投稿する"
        >
          Xに投稿
        </button>
      </div>
    </div>
  );
}

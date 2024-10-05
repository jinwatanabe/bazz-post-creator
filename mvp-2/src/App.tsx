import { useState } from "react";

const cookingMethods = ["焼く", "煮る", "蒸す", "揚げる", "炒める"];
const foods = [
  "ピザ",
  "ラーメン",
  "ハンバーガー",
  "寿司",
  "タコス",
  "カレーライス",
  "スパゲッティ",
  "フライドチキン",
  "たこ焼き",
  "餃子",
  "サンドイッチ",
  "パエリア",
  "グラタン",
  "フレンチトースト",
  "天ぷら",
  "フィッシュ&チップス",
  "オムライス",
  "ピタパン",
  "お好み焼き",
  "チーズケーキ",
];

function App() {
  const [cookingMethod, setCookingMethod] = useState("");
  const [food, setFood] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  const handleChangeMenu = () => {
    setIsSpinning(true);
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      const randomCookingMethod =
        cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      setCookingMethod(randomCookingMethod);
      setFood(randomFood);
      spinCount++;
      if (spinCount > 10) {
        clearInterval(spinInterval);
        setIsSpinning(false);
      }
    }, 100);

    setTimeout(() => {
      const randomCookingMethod =
        cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      setCookingMethod(randomCookingMethod);
      setFood(randomFood);
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
          <div className="mb-6">
            <div
              className={`text-2xl font-bold transition-all duration-500 ${
                isSpinning ? "animation-spin text-gray-400" : ""
              }`}
            >
              調理方法 : {cookingMethod || "？？？"}
            </div>
            <div
              className={`text-2xl font-bold transition-all duration-500 mb-8 ${
                isSpinning ? "animation-spin text-gray-400" : ""
              }`}
            >
              料理名 : {food || "？？？"}
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
              onClick={handleChangeMenu}
              disabled={isSpinning}
            >
              {isSpinning ? "生成中‥" : "レシピ生成"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

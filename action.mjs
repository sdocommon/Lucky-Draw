import {spin} from "./wheel.mjs"
let names = [];
// 是否正在滾動（避免重複點擊）
let isRolling = false;
// 目前捲動到的位置（y 距離，單位 px）
let currentPosition = 0;

// 初始化：先建一次空容器
setupBoxes();
// Sidebar toggle functionality
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden"); // 切换隐藏状态
});

// 依照 names 內容，建構容器
function setupBoxes() {
    const boxesContainer = document.getElementById("boxes");
    boxesContainer.innerHTML = "";

    // 至少放 30 個 box，以保證滾動距離夠大
    const displayCount = Math.max(names.length * 3, 30);

    for (let i = 0; i < displayCount; i++) {
        const box = document.createElement("div");
        box.classList.add("box");
        // 若有名字則循環填寫，否則留空
        box.textContent = names.length > 0 ? names[i % names.length] : " ";
        boxesContainer.appendChild(box);
    }

    // 重置 ~ 目前位置
    boxesContainer.style.transform = `translateY(-${currentPosition}px)`;
}

const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", function () {
    const input = document.getElementById("nameInput").value.trim();
    if (input) {
        // 將使用者輸入的每一行轉成陣列
        names = input.split("\n").filter(name => name.trim() !== "");
        alert(`Names saved! Total entries: ${names.length}`);
        // 新增完名單，重置位置並重新建構箱子
        currentPosition = 0;
        setupBoxes();
        //saveButton.disabled = true;
    }
});


document.getElementById("drawButton").addEventListener("click", function () {
    // 若正在滾動或名單為空，則不動作
    if (isRolling || names.length === 0) return;

    const boxesContainer = document.getElementById("boxes");
    const winnerDisplay = document.getElementById("winner");
    const winSound = document.getElementById("winSound");
    const chart = document.getElementById("chart");
    const door = document.getElementById("door");
    
    let number = document.getElementById("numberInput").value.trim();
    if (number == 1) {
        door.classList.remove("invisible")
        boxesContainer.style.visibility = "visible";
        // 抽出目前名單中的中獎 index
        const winnerIndex = Math.floor(Math.random() * names.length);
        // 得獎者會位置剛好落在 (winnerIndex * 150) ~ 也就是 boxes 的高度 (150px) * 該 index
        const targetPosition = winnerIndex * 150;

        // 算出目前容器所有 box 的總高度
        const totalHeight = boxesContainer.children.length * 150;

        // 要從 currentPosition「滾到」(最後 + 目標)，以確保畫面連續
        // totalHeight - currentPosition 讓畫面先滾到底，再前進 targetPosition
        let scrollDistance = totalHeight - currentPosition + targetPosition;

        // 為了連續的滾動效果，在容器末端多複製一些 box
        const cloneCount = Math.ceil(scrollDistance / 150) + 5;
        for (let i = 0; i < cloneCount; i++) {
            const box = document.createElement("div");
            box.classList.add("box");
            // 為了視覺連續，依舊用 names[i % names.length]
            // 但注意：用的是「此刻」的 names
            box.textContent = names[i % names.length];
            boxesContainer.appendChild(box);
        }

        isRolling = true;
        // 加上動畫效果
        boxesContainer.style.transition = "transform 3s cubic-bezier(0.33, 0, 0.67, 1)";
        boxesContainer.style.transform = `translateY(-${currentPosition + scrollDistance}px)`;

        // 動畫結束之後...
        setTimeout(() => {
            // 關掉 transition（以免之後瞬間重定位會看到跳動）
            boxesContainer.style.transition = "none";

            // 最終畫面落在 (currentPosition + scrollDistance)
            currentPosition = currentPosition + scrollDistance;

            // 顯示中獎資訊
            winnerDisplay.textContent = `🎉 Congratulations, ${names[winnerIndex]}! 🎉`;
            // 播放音效
            winSound.play();

            // 把這位幸運兒 從陣列中移除 (下次就不會再被抽到)
            names.splice(winnerIndex, 1);

            // 不移除畫面上多餘的 box，也不做位置歸零。
            // 讓轉盤「保持在此畫面」不動，直到下次抽獎。

            isRolling = false;
        }, 3000);
    }else{
        if (names.length < number) {
            alert("Not enough names");
            return;
        }
        winnerDisplay.textContent = ""
        door.classList.add("invisible")
        chart.classList.add("visible");
        chart.classList.remove("hidden")
        isRolling = true
        spin();
        setTimeout(() =>{
            chart.classList.remove("visible");
            chart.classList.add("hidden")
            const pickedNames = [];
            for (let i = 0; i < number; i++) {
                const randomIndex = Math.floor(Math.random() * names.length);
                pickedNames.push(names[randomIndex]);
                names.splice(randomIndex, 1);
            }
    
            const pickedNamesList = document.getElementById("pickedNamesList");
            pickedNamesList.innerHTML = "";
            pickedNames.forEach(name => {
                const li = document.createElement("li");
                li.textContent = name;
                li.className = "list-group-item";
                pickedNamesList.appendChild(li);
            });
    
            const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
            resultModal.show();
            isRolling = false;
        }, 3000);
    }
});
let keyPressCount = 0;

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp': // 遥控器的上键
            keyPressCount++;
            if (keyPressCount === 2) {
                document.getElementById("drawButton").click(); // 模拟点击 Button 1
                keyPressCount = 0; // 重置按鍵計數
            }
            break;
        case 'ArrowDown': // 遥控器的下键
            keyPressCount++;
            if (keyPressCount === 2) {
                document.getElementById("drawButton").click(); // 模拟点击 Button 1
                keyPressCount = 0; // 重置按鍵計數
            }
            break;
        default:
            keyPressCount = 0; // 如果按下其他按鍵，重置按鍵計數
    }
});
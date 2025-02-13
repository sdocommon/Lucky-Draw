// Sidebar toggle functionality
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden"); // 切换隐藏状态
});


saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", function () {
    const input = document.getElementById("nameInput").value.trim();
    if (input) {
        // 將使用者輸入的每一行轉成陣列
        names = input.split("\n").filter(name => name.trim() !== "");
        alert(`Names saved! Total entries: ${names.length}`);
        // 新增完名單，重置位置並重新建構箱子
        currentPosition = 0;
        setupBoxes();
    }
});

document.getElementById("drawButton").addEventListener("click", function () {
    // 若正在滾動或名單為空，則不動作
    if (isRolling || names.length === 0) return;

    const winnerDisplay = document.getElementById("winner");
    const winSound = document.getElementById("winSound");

    // 讀取用戶輸入的抽獎人數
    const drawCountInput = document.getElementById("drawCount").value.trim();
    const drawCount = Math.min(parseInt(drawCountInput, 10), names.length); // 限制最大值為剩餘名單長度

    if (isNaN(drawCount) || drawCount <= 0) {
        alert("Please enter a valid number!");
        return;
    }

    // 儲存中獎者
    let winners = [];
    let scrollDistance = 0;

    for (let i = 0; i < drawCount; i++) {
        const winnerIndex = Math.floor(Math.random() * names.length);
        winners.push(names[winnerIndex]);
        names.splice(winnerIndex, 1);
    }

    isRolling = true;
    setTimeout(() => {
        boxesContainer.style.transition = "none";


        isRolling = false;
    }, 3000);
});

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp': // 遥控器的上键
            document.getElementById("drawButton").click(); // 模拟点击 Button
            break;
        case 'ArrowDown': // 遥控器的下键
            document.getElementById("drawButton").click(); // 模拟点击 Button
            break;
        default:
            console.log(`Unhandled key: ${event.code}`);
    }
});
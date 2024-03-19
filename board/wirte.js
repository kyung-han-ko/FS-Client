const token = localStorage.getItem("UserToken");
const loginButton = document.getElementById("log_in_button");
const logout_button = document.getElementById("mypage_button");
const nickname = localStorage.getItem("UserName");
const getnickname = document.getElementById("getnickname");
const calendarstring = document.getElementById("calendarstring");

if (!token) {
  window.location.href = "./login.html";
  calendarstring.style.display = "none";
  getnickname.style.display = "none";
} else {
  loginButton.style.display = "none";
  getnickname.textContent = nickname;
  calendarstring.textContent = "님";
  calendarstring.style.display = "inline";
}

document.getElementById("logout_button").addEventListener("click", function () {
  const logoutButton = document.getElementById("logout_button");
  const token = localStorage.getItem("UserToken");

  if (token) {
    Swal.fire({
      title: "Station Logout",
      text: '로그아웃을 희망하시면 "네"를 클릭하세요',
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네",
      cancelButtonText: "아니요",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("hi");
        localStorage.removeItem("UserToken");
        localStorage.removeItem("UserId");
        localStorage.removeItem("UserName");
        logoutButton.style.display = "none";
        Swal.fire(
          "로그아웃",
          "로그아웃이 성공적으로 완료되었습니다.",
          "success"
        );
        //강제로 새로고침하는 코드
        location.reload(true);
      }
    });
  }
});

// 글 작성하면 서버로 보낸다

document.getElementById("submit").addEventListener("click", function () {
  fetch("http://localhost:8080/api/boardSubmit", {
    method: "post",
    body: JSON.stringify({
      UserId: localStorage.getItem("UserId"),
      UserName: localStorage.getItem("UserName"),
      title: document.getElementById("title2").value,
      content: document.getElementById("content").value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  })
    .then(function (res) {
      console.log(res);
      return res.json();
    })
    .then(function (res) {
      console.log(res);
      if (res.success) {
        console.log("success");
        Swal.fire({
          title: "Record Board",
          text: "위 글을 게시판에 등록하시겠습니까?",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "rgb(119, 110, 250)",
          cancelButtonColor: "rgb(158, 158, 158)",
          confirmButtonText: "네 저장하겠습니다",
          cancelButtonText: "취소하겠습니다",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "../board/index.html";
          }
        });
      } else {
        console.log("failed");
      }
    })
    .catch(function (err) {
      console.error("에러:", err);
    });
});

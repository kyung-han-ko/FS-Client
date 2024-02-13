//헤더 로직. 토큰과 아이디, 비번 받아와서 닉네임 띄워주고 로그아웃되면 모두 사라진다

const token = localStorage.getItem("UserToken");
const loginButton = document.getElementById("log_in_button");
const logout_button = document.getElementById("logout_button");
const nickname = localStorage.getItem("UserName");
const getnickname = document.getElementById("getnickname");
const calendarstring = document.getElementById("calendarstring");

if (!token) {
  // window.location.href = "./login.html";
  calendarstring.style.display = "none";
  getnickname.style.display = "none";
  logout_button.style.display = "none";
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

// 페이지 네이션

// 게시판

document.addEventListener("DOMContentLoaded", function () {
  let currentData = 1; // 전역변수로 선언하고 밑에 패치에 넣었음
  //페이지 이동할때마다 붙여주고 넘어가야함
  const pageSize = 10; // 10개씩 담고
  const pageGroupSize = 10; // 번호도 10개씩 만들어봄;
  function fetchData(data) {
    currentData = data;
    fetch(`http://localhost:8080/getAllPost`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        if (res.success) {
          const allPost = res.allPost;
          //올포스트에서 내가 지정한만큼 나누는 수식임. 모든 포스트를 10개로 나눈거임
          const allPages = Math.ceil(allPost / pageSize);
          //그걸 올페이지스에 담아서 마지막이 되게 만들었음
          displayPagenation(allPages);
          fetchPageData(currentData);
        } else {
          console.log("failed");
        }
      })
      .catch(function (err) {
        console.error("에러:", err);
      });
  }
  function fetchPageData(currentData) {
    fetch(
      `http://localhost:8080/getBoardData?currentData=${currentData}&pageSize=${pageSize}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      }
    )
      .then(function (res) {
        return res.json();
      })
      .then(function (res) {
        if (res.success) {
          displayData(res.result); // 새로운 데이터 표시
        } else {
          console.log("데이터 가져오기 실패");
        }
      })
      .catch(function (err) {
        console.error("에러:", err);
      });
  }

  function displayPagenation(allPages) {
    const pagenation = document.getElementById("pagenation");
    pagenation.innerHTML = "";
    const deletePastData = document.getElementById("board2");
    deletePastData.innerHTML = "";

    const firstButton = document.createElement("button");
    firstButton.textContent = "◀◀";
    firstButton.classList.add("firstButton");
    firstButton.addEventListener("click", function () {
      fetchData(1);
    });
    pagenation.appendChild(firstButton);

    const prevButtion = document.createElement("button");
    prevButtion.textContent = "◀";
    prevButtion.addEventListener("click", function () {
      if (currentData > 1) {
        fetchData(currentData - 1);
      }
    });
    pagenation.appendChild(prevButtion);

    const startPage =
      Math.floor((currentData - 1) / pageGroupSize) * pageGroupSize + 1;
    //소수점 없애기.1 , 11 , 21로 떨어짐 무조건. 페이지 시작점. 페이지 네이션 시작점
    const endPage = Math.min(startPage + pageGroupSize - 1, allPages);
    //가장 최소값을 추출하는 매스민을 이용했음. 올페이지 안붙이면 31번 이후로도 넘어가버림
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      if (currentData === i) {
        pageButton.classList.add("selected");
      }
      pageButton.addEventListener("click", function () {
        fetchData(i);
      });
      pagenation.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "▶";
    nextButton.addEventListener("click", function () {
      if (currentData < allPages) {
        fetchData(Math.min(currentData + 1, allPages));
      } else {
        alert("마지막 페이지라네 친구");
      }
    });
    pagenation.appendChild(nextButton);

    const lastButton = document.createElement("button");
    lastButton.textContent = "▶▶";
    lastButton.classList.add("lastButton");
    lastButton.addEventListener("click", function () {
      fetchData(allPages);
    });
    pagenation.appendChild(lastButton);
  }

  fetchData(currentData);
});

function displayData(data) {
  const boardContainer = document.getElementById("board2");

  data.forEach((info, index) => {
    const createDiv = document.createElement("div");
    createDiv.classList.add("board-post");
    //꼭 기억해야 하는 코드 아래꺼
    createDiv.setAttribute("id", info.boardid);

    const writerDiv = document.createElement("div");
    writerDiv.classList.add("post-writer");
    writerDiv.textContent = info.name;

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("post-title");
    titleDiv.textContent = info.title;

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("post-date");
    dateDiv.textContent = formatDate(info.createdAt);

    const indexDiv = document.createElement("div");
    indexDiv.classList.add("post-index");
    indexDiv.textContent = index + 1;

    const lookDiv = document.createElement("div");
    lookDiv.classList.add("post-look");
    lookDiv.textContent = info.look;

    createDiv.appendChild(indexDiv);
    createDiv.appendChild(writerDiv);
    createDiv.appendChild(titleDiv);
    createDiv.appendChild(dateDiv);
    createDiv.appendChild(lookDiv);

    boardContainer.appendChild(createDiv);
  });
}

// 연,월,일,시간,분,초로 데이터 포맷
function formatDate(changeDate) {
  const date = new Date(changeDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

// 앤드포인트 겹쳐서 서버로직하나 추가하고 순서에 맞게 처리하려고 로직이 좀 조잡함..
// 조회수 2개씩 올라가서 패치 방식을 하나하나 처리했음
// 그리고 div주변을 눌러야 들어가져서 closest로 변경했음, 그위에 부모요소로 클릭되게끔

document.addEventListener("click", function (event) {
  const clickDiv = event.target.closest(".board-post");

  if (clickDiv) {
    const boardid = clickDiv.id;

    fetch(`http://localhost:8080/getBoardText?boardid=${boardid}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          fetch(`http://localhost:8080/increaseLook?boardid=${boardid}`)
            .then((res) => res.json())
            .then((res) => {
              if (res.success) {
                window.location.href = `./boardView.html?boardid=${boardid}`;
              } else {
                console.log("게시글 가져오기 실패");
              }
            })
            .catch((error) => console.error("에러:", error));
        } else {
          console.log("조회수 증가 실패");
        }
      })
      .catch((error) => console.error("에러:", error));
  }
});

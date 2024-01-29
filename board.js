//헤더 로직. 토큰과 아이디, 비번 받아와서 닉네임 띄워주고 로그아웃되면 모두 사라진다

const token = localStorage.getItem("UserToken");
const loginButton = document.getElementById('log_in_button');
const logout_button = document.getElementById('mypage_button');
const nickname = localStorage.getItem("UserName");
const getnickname = document.getElementById('getnickname');
const calendarstring = document.getElementById('calendarstring');

if (!token) {
  window.location.href = "./login.html";
  calendarstring.style.display = 'none';
  getnickname.style.display = 'none';
} else {
  loginButton.style.display = 'none';
  getnickname.textContent = nickname;
  calendarstring.textContent = "님";
  calendarstring.style.display = 'inline';
}

document.getElementById("logout_button").addEventListener("click", function(){
    const logoutButton = document.getElementById("logout_button");
    const token = localStorage.getItem("UserToken");
  
    if (token) {
        Swal.fire({
            title: 'Station Logout',
            text: '로그아웃을 희망하시면 "네"를 클릭하세요',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네',
            cancelButtonText: '아니요',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('hi')
                localStorage.removeItem("UserToken");
                localStorage.removeItem("UserId");
                localStorage.removeItem("UserName");
                logoutButton.style.display = "none";
                Swal.fire('로그아웃', '로그아웃이 성공적으로 완료되었습니다.', 'success');
                //강제로 새로고침하는 코드
                location.reload(true);
            }
        });
    }
  });

  // 게시판

  document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("UserId");

    function fetchData() {
      fetch("http://localhost:8080/getBoardData", {
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
            displayData(res.result);
          } else {
            console.log("데이터 가져오기 실패");
          }
        })
        .catch(function (err) {
          console.error('에러:', err);
        });
    }
    fetchData();
  });

  // append해서 HTML에 표시함
  function displayData(data) {
    const boardContainer = document.getElementById("board2");
    boardContainer.innerHTML = "";
  
    data.forEach((info,index) => {
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

//앤드포인트 겹쳐서 서버로직하나 추가하고 순서에 맞게 처리하려고 로직이 좀 조잡함..

document.addEventListener("click", function (event) {
  const clickDiv = event.target.closest('.board-post');

  if (clickDiv) {
    const boardid = clickDiv.id;

    fetch(`http://localhost:8080/getBoardText?boardid=${boardid}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          fetch(`http://localhost:8080/increaseLook?boardid=${boardid}`)
            .then(res => res.json())
            .then(res => {
              if (res.success) {
                window.location.href = `./boardView.html?boardid=${boardid}`;
              } else {
                console.log("게시글 가져오기 실패");
              }
            })
            .catch(error => console.error('에러:', error));
        } else {
          console.log("조회수 증가 실패");
        }
      })
      .catch(error => console.error('에러:', error));
  }
});
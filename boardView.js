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


  /* */

  document.addEventListener("DOMContentLoaded", function () {
    // const boardId = getParameterByName('boardid');
    const queryParams = new URLSearchParams(window.location.search);
    const boardId = queryParams.get('boardid');

    function fetchData() {
        fetch(`http://localhost:8080/getBoardText?boardid=${boardId}`, {
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
                displayBoardInfo(res.result);
            } else {
                console.log("데이터 가져오기 실패");
            }
        })
        .catch(function (err) {
            console.error('에러:', err);
        });
    }
    fetchData();

    function displayBoardInfo(boardInfo) {
        const boardDiv = document.getElementById("boardInfo");
    
            // 글의 정보를 표시하는 로직을 작성
            const writerDiv = document.createElement("div");
            writerDiv.textContent = `Name : ${boardInfo[0].name}`;
            writerDiv.classList.add("name-post");

            const dateDiv = document.createElement("div");
            dateDiv.textContent = `Date : ${formatDate(boardInfo[0].createdAt)}`;
            dateDiv.classList.add("date-post")

            const titleDiv = document.createElement("div");
            titleDiv.textContent = `Title : ${boardInfo[0].title}`;
            titleDiv.classList.add("title-post")
    
            const textDiv = document.createElement("div");
            textDiv.textContent = `${boardInfo[0].text}`;
            textDiv.classList.add("text-post")
    
            boardDiv.appendChild(writerDiv);
            boardDiv.appendChild(dateDiv);
            boardDiv.appendChild(titleDiv);
            boardDiv.appendChild(textDiv);

    }

    function formatDate(changeDate) {
        const date = new Date(changeDate);
        
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
      
        // 원하는 형식으로 조합
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
      }

    // function getParameterByName(name, url = window.location.href) {
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
    //         results = regex.exec(url);
    //     if (!results) return null;
    //     if (!results[2]) return '';
    //     return decodeURIComponent(results[2].replace(/\+/g, ' '));
    // }

});

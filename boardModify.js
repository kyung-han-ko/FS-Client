// //헤더 로직. 토큰과 아이디, 비번 받아와서 닉네임 띄워주고 로그아웃되면 모두 사라진다

// const token = localStorage.getItem("UserToken");
// const loginButton = document.getElementById('log_in_button');
// const logout_button = document.getElementById('mypage_button');
// const nickname = localStorage.getItem("UserName");
// const getnickname = document.getElementById('getnickname');
// const calendarstring = document.getElementById('calendarstring');

// if (!token) {
//   window.location.href = "./login.html";
//   calendarstring.style.display = 'none';
//   getnickname.style.display = 'none';
// } else {
//   loginButton.style.display = 'none';
//   getnickname.textContent = nickname;
//   calendarstring.textContent = "님";
//   calendarstring.style.display = 'inline';
// }

// document.getElementById("logout_button").addEventListener("click", function(){
//     const logoutButton = document.getElementById("logout_button");
//     const token = localStorage.getItem("UserToken");
  
//     if (token) {
//         Swal.fire({
//             title: 'Station Logout',
//             text: '로그아웃을 희망하시면 "네"를 클릭하세요',
//             icon: 'success',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: '네',
//             cancelButtonText: '아니요',
//             reverseButtons: true,
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 console.log('hi')
//                 localStorage.removeItem("UserToken");
//                 localStorage.removeItem("UserId");
//                 localStorage.removeItem("UserName");
//                 logoutButton.style.display = "none";
//                 Swal.fire('로그아웃', '로그아웃이 성공적으로 완료되었습니다.', 'success');
//                 //강제로 새로고침하는 코드
//                 location.reload(true);
//             }
//         });
//     }
//   });


//   /**/

//   document.addEventListener("DOMContentLoaded", function () {
//     // localStorage에서 boardid를 가져옴
//     const boardId = localStorage.getItem("saveBoardId");

//     // boardid가 있는지 확인 후 서버에 요청
//     if (boardId) {
//         fetch(`http://localhost:8080/getBoardTextForEdit?boardid=${boardId}`, {
//             method: "get",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             credentials: "include",
//             mode: "cors",
//         })
//         .then(function (res) {
//             return res.json();
//         })
//         .then(function (res) {
//             if (res.success) {
//                 fillScript(res.result[0]);
//             } else {
//                 console.log("데이터 가져오기 실패");
//             }
//         })
//         .catch(function (err) {
//             console.error('에러:', err);
//         });
//     } else {
//         console.log("boardid가 없음");
//     }
// });

// function fillScript(boardInfo) {
//     const titleInput = document.getElementById("title");
//     const textInput = document.getElementById("text");
//     titleInput.value = boardInfo.title;
//     textInput.value = boardInfo.text;
// }

// // 수정버튼 누르면 발동되는 로직임
// const updateButton = document.getElementById("updateButton");
// updateButton.addEventListener("click", function () {
//     const titleInput = document.getElementById("title");
//     const textInput = document.getElementById("text");

//     const boardId = localStorage.getItem("saveBoardId");

//     // 서버에 수정 내용을 전송
//     fetch(`http://localhost:8080/updateBoard?boardid=${boardId}`, {
//         method: "post",
//         body: JSON.stringify({
//             title : titleInput.value,
//             text : textInput.value,
//         }),
//         headers: {
//             "Content-Type": "application/json",
//         },
//         credentials: "include",
//         mode: "cors",
//     })
//     .then(function (res) {
//         return res.json();
//     })
//     .then(function (res) {
//         if (res.success) {
//             Swal.fire('Update Success', '게시물이 성공적으로 수정되었습니다.', 'success');
//             // 수정 성공 후 다른 페이지로 이동하거나 필요한 작업 수행
//             console.log(res.result)
//         } else {
//             Swal.fire('Update Failed', '게시물 수정에 실패하였습니다.', 'error');
//         }
//     })
//     .catch(function (err) {
//         console.error('에러:', err);
//     });
// });

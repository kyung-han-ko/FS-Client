//로그인 로그아웃 공통로직

const token = localStorage.getItem("UserToken");
const loginButton = document.getElementById("log_in_button");
const logout_button = document.getElementById("logout_button");
const nickname = localStorage.getItem("UserName");
const getnickname = document.getElementById("getnickname");
const calendarstring = document.getElementById("calendarstring");
const replyBox = document.getElementById("replyBox");

if (!token) {
  //   window.location.href = "./login.html";
  calendarstring.style.display = "none";
  getnickname.style.display = "none";
  logout_button.style.display = "none";
  replyBox.style.display = "none";
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

// 클릭하면 이동해서 그 글의 보드아이디 조회해서 보여주는 로직임

document.addEventListener("DOMContentLoaded", function () {
  // const boardId = getParameterByName('boardid');
  const queryParams = new URLSearchParams(window.location.search);
  const boardId = queryParams.get("boardid");

  // 여기서 정말 많이 힘들었는데 꼭 기억하자
  // URLSearchParams~ 이거는 위에 url에 ? 다음으로 적힌 파라미터 즉 보드 아이디 추출
  // 그리고 쿼리 파람스.get은 boardid에 해당하는 값을 가져오겠다는 뜻임

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
          const userId = localStorage.getItem("UserId");
          const showDeleteButton = res.result[0].userid;
          const deleteButton = document.getElementById("delete");
          const modifyButton = document.getElementById("modify");
          console.log(userId === String(showDeleteButton));
          //userId가 문자열이였고, 넘어온건 데이터 형식이라 문자열로 전환해서 비교함
          if (userId === String(showDeleteButton)) {
            deleteButton.style.display = "block";
            modifyButton.style.display = "block";
          } else {
            deleteButton.style.display = "none";
            modifyButton.style.display = "none";
          }

          displayBoardInfo(res.result);
        } else {
          console.log("데이터 가져오기 실패");
        }
      })
      .catch(function (err) {
        console.error("에러:", err);
      });
  }
  fetchData();

  function displayBoardInfo(boardInfo) {
    const boardDiv = document.getElementById("boardInfo");

    // 뷰접속하자마자 해당내용 들어가서 보여주는 로직임
    const writerDiv = document.createElement("div");
    writerDiv.textContent = `Name : ${boardInfo[0].name}`;
    writerDiv.classList.add("name-post");

    const dateDiv = document.createElement("div");
    dateDiv.textContent = `Date : ${formatDate(boardInfo[0].createdAt)}`;
    dateDiv.classList.add("date-post");

    const titleDiv = document.createElement("div");
    titleDiv.textContent = `Title : ${boardInfo[0].title}`;
    titleDiv.classList.add("title-post");

    const textDiv = document.createElement("div");
    textDiv.textContent = `${boardInfo[0].text}`;
    textDiv.classList.add("text-post");

    boardDiv.appendChild(writerDiv);
    boardDiv.appendChild(dateDiv);
    boardDiv.appendChild(titleDiv);
    boardDiv.appendChild(textDiv);
  }

  //데이터 포맷하는 로직, 계속 사용하되 , 시분초 나누었음

  function formatDate(changeDate) {
    const date = new Date(changeDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // 원하는 형식으로 조합
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }
});

// 게시판 이동 로직

const gobackButton = document.getElementById("goback");
gobackButton.addEventListener("click", function () {
  window.location.href = "./index.html";
});

// 아이디 맞으면 게시판 삭제로직

const deleteButton = document.getElementById("delete");
deleteButton.addEventListener("click", function () {
  const userId = localStorage.getItem("UserId");
  const queryParams = new URLSearchParams(window.location.search);
  const boardId = queryParams.get("boardid");

  if (userId) {
    Swal.fire({
      title: "게시판 삭제",
      text: "게시판을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(119, 110, 250)",
      cancelButtonColor: "rgb(158, 158, 158)",
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소하기",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/deleteBoard?boardid=${boardId}`, {
          method: "post",
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
              Swal.fire(
                "Delete Success",
                "게시판이 성공적으로 삭제되었습니다.",
                "success"
              ).then(() => {
                window.location.href = "/board/index.html";
              });
            } else {
              Swal.fire(
                "Delete Failed",
                "게시판 삭제에 실패하였습니다.",
                "error"
              );
            }
          })
          .catch(function (err) {
            console.error("에러:", err);
          });
      }
    });
  }
});

// 수정 버튼 클릭 시 글 내용 가져오는 로직
const modifyButton = document.getElementById("modify");
modifyButton.addEventListener("click", function () {
  const queryParams = new URLSearchParams(window.location.search);
  const boardId = queryParams.get("boardid");

  fetch(`http://localhost:8080/modifyBoard?boardid=${boardId}`, {
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
        // window.location.href = "boardModify.html";
        const containerReply = document.getElementById("containerReply");
        containerReply.style.display = "none";

        const boardInfoContainer =
          document.getElementById("boardInfoContainer");
        const goback = document.getElementById("goback");
        const deleteButton = document.getElementById("delete");
        const modify = document.getElementById("modify");
        const container = document.getElementById("container");

        boardInfoContainer.style.display = "none";
        goback.style.display = "none";
        deleteButton.style.display = "none";
        modify.style.display = "none";
        container.style.display = "block";

        if (boardId) {
          fetch(`http://localhost:8080/modifyBoard?boardid=${boardId}`, {
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
                fillScript(res.result[0]);
              } else {
                console.log("데이터 가져오기 실패");
              }
            })
            .catch(function (err) {
              console.error("에러:", err);
            });
        } else {
          console.log("보드 아이디가 없음");
        }
      } else {
        console.log("데이터 가져오기 실패");
      }
    })
    .catch(function (err) {
      console.error("에러:", err);
    });
});

// 기존에 있던 글 채워넣기
function fillScript(boardInfo) {
  const titleInput = document.getElementById("title");
  const textInput = document.getElementById("text");
  titleInput.value = boardInfo.title;
  textInput.value = boardInfo.text;
}

// 수정버튼 누르면 발동되는 로직임
const updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", function () {
  const queryParams = new URLSearchParams(window.location.search);
  const boardId = queryParams.get("boardid");

  const titleInput = document.getElementById("title");
  const textInput = document.getElementById("text");

  // 서버에 수정 내용을 전송
  fetch(`http://localhost:8080/updateBoard?boardid=${boardId}`, {
    method: "post",
    body: JSON.stringify({
      title: titleInput.value,
      text: textInput.value,
    }),
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
        Swal.fire(
          "Update Success",
          "게시물이 성공적으로 수정되었습니다.",
          "success"
        ).then(() => {
          window.location.href = `/board/detail.html?boardid=${boardId}`;
        });
      } else {
        Swal.fire("Update Failed", "게시물 수정에 실패하였습니다.", "error");
      }
    })
    .catch(function (err) {
      console.error("에러:", err);
    });
});

// 취소하기 버튼 > 돌아가기

const cancelButton = document.getElementById("cancel");
const queryParams = new URLSearchParams(window.location.search);
const boardId = queryParams.get("boardid");

cancelButton.addEventListener("click", function () {
  Swal.fire("Update Cancel", "게시물 수정을 취소하셨습니다", "info").then(
    () => {
      window.location.href = `./boardView.html?boardid=${boardId}`;
    }
  );
});

// 댓글 전송 패치

const saveReplyButton = document.getElementById("saveReply");
saveReplyButton.addEventListener("click", function () {
  const queryParams = new URLSearchParams(window.location.search);
  const boardId = queryParams.get("boardid");

  fetch(`http://localhost:8080/insertReply?boardid=${boardId}`, {
    method: "post",
    body: JSON.stringify({
      UserId: localStorage.getItem("UserId"),
      text: document.getElementById("reply").value,
      UserName: localStorage.getItem("UserName"),
    }),
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
        console.log("success");
        document.getElementById("reply").value = "";
        location.reload();
      } else {
        console.log("fail");
      }
    })
    .catch(function (err) {
      console.error("에러:", err);
    });
});

// 댓글 불러오기 및 append

document.addEventListener("DOMContentLoaded", function () {
  const queryParams = new URLSearchParams(window.location.search);
  const boardId = queryParams.get("boardid");
  const userId = localStorage.getItem("UserId");

  fetch(`http://localhost:8080/getUserReply?boardid=${boardId}`, {
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
        const userCreatReply = document.getElementById("userCreatReply");

        res.result.forEach((reply) => {
          const replyElement = document.createElement("div");
          replyElement.classList.add("reply");

          const nameDiv = document.createElement("div");
          nameDiv.classList.add("reply-name");
          nameDiv.textContent = reply.name + " 님의 댓글 : ";

          const textDiv = document.createElement("div");
          textDiv.classList.add("reply-text");
          textDiv.textContent = reply.text;

          const buttonDiv = document.createElement("div");
          buttonDiv.classList.add("reply-buttons");

          const editButton = document.createElement("button");
          editButton.textContent = "수정";

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "삭제";

          //삭제버튼 클릭시에 로직발동
          deleteButton.addEventListener("click", function () {
            swal
              .fire({
                title: "정말로 삭제하시겠습니까?",
                text: "삭제시 댓글 복구가 불가능합니다",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "rgb(109, 109, 235)",
                cancelButtonColor: "gray",
                cancelButtonText: "아니요",
                confirmButtonText: "네",
              })
              .then((result) => {
                if (result.isConfirmed) {
                  fetch(
                    `http://localhost:8080/deleteUserReply?replyid=${reply.replyid}`,
                    {
                      method: "post",
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
                        swal
                          .fire(
                            "삭제 완료!",
                            "댓글이 성공적으로 삭제되었습니다.",
                            "success"
                          )
                          .then(() => {
                            location.reload();
                          });
                      } else {
                      }
                    })
                    .catch(function (err) {
                      console.error("에러:", err);
                    });
                }
              });
          });

          //수정버튼 클릭시에 로직발동

          editButton.addEventListener("click", function () {
            fetch(
              `http://localhost:8080/getUserModifyReply?replyid=${reply.replyid}`,
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
                  document.getElementById("h1").style.display = "none";
                  document.getElementById("saveReply").style.display = "none";
                  document.getElementById("reply").style.display = "none";
                  const userCreatReply =
                    document.getElementById("userCreatReply");
                  const containerReply =
                    document.getElementById("containerReply");

                  userCreatReply.style.display = "none";
                  containerReply.style.display = "block";

                  const replytext = document.getElementById("replytext");
                  const modifyData = res.result[0].text;
                  replytext.textContent = modifyData;

                  const cancelReply = document.getElementById("cancelReply");
                  cancelReply.addEventListener("click", function () {
                    window.location.href = `./boardView.html?boardid=${boardId}`;
                  });
                }
              })
              .catch(function (err) {
                console.error("에러:", err);
              });
          });

          // 댓글 수정 로직, 클릭하면 시작됨
          const updateButtonReply =
            document.getElementById("updateButtonReply");
          const replytext = document.getElementById("replytext");

          updateButtonReply.addEventListener("click", function () {
            swal
              .fire({
                title: "정말로 수정하시겠습니까?",
                text: "작성하신 내용대로 댓글을 수정합니다",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "rgb(109, 109, 235)",
                cancelButtonColor: "gray",
                cancelButtonText: "아니요",
                confirmButtonText: "네",
              })
              .then((result) => {
                if (result.isConfirmed) {
                  fetch(
                    `http://localhost:8080/modifyUserReply?replyid=${reply.replyid}`,
                    {
                      method: "post",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        text: replytext.value,
                      }),
                      credentials: "include",
                      mode: "cors",
                    }
                  )
                    .then(function (res) {
                      return res.json();
                    })
                    .then(function (res) {
                      if (res.success) {
                        swal
                          .fire(
                            "수정 완료!",
                            "댓글이 성공적으로 수정되었습니다.",
                            "success"
                          )
                          .then(() => {
                            location.reload();
                          });
                      } else {
                      }
                    })
                    .catch(function (err) {
                      console.error("에러:", err);
                    });
                }
              });
          });

          buttonDiv.appendChild(editButton);
          buttonDiv.appendChild(deleteButton);

          replyElement.appendChild(nameDiv);
          replyElement.appendChild(textDiv);
          replyElement.appendChild(buttonDiv);

          userCreatReply.appendChild(replyElement);

          if (userId === String(reply.userid)) {
            buttonDiv.style.display = "block";
          } else {
            buttonDiv.style.display = "none";
          }
        });
      } else {
        console.log("실패임~");
      }
    })
    .catch(function (err) {
      console.error("에러:", err);
    });
});

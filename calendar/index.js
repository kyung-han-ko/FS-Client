const token = localStorage.getItem("UserToken");
const loginButton = document.getElementById("log_in_button");
const logout_button = document.getElementById("mypage_button");
const nickname = localStorage.getItem("UserName");
const getnickname = document.getElementById("getnickname");
const calendarstring = document.getElementById("calendarstring");

if (!token) {
  window.location.href = "../login/index.html";
  calendarstring.style.display = "none";
  getnickname.style.display = "none";
} else {
  loginButton.style.display = "none";
  getnickname.textContent = nickname;
  calendarstring.textContent = " 님의 기록들";
  calendarstring.style.display = "inline";
}

// 회원이 아니면 튕겨내기

let currentYM = ""; // 전역변수 => 2024-01
let dateHandler = ""; // 전역변수 => new Date(info.dateStr)
let calendarData = ""; // calendarData가 정의되지 않아서 , 아래 res.result로 받아온다음 이 절차를 실행함
let clickedDate = "";
let clickedEventId = "";

// 필요한 전역 변수들을 선언해놓은 로직
// 화면을 띄우자마자 보여지는 화면에 대한 로직, DOMContentLoaded를 잘 기억해야함

document.addEventListener("DOMContentLoaded", function () {
  // addEventListener의 의미 : 특정한 이벤트에 반응할 수 있도록 준비된 !

  calendar.setOption("eventClick", function (info) {
    clickedDate = info.event.start;
    clickedEventId = info.event.id; // 클릭한 이벤트의 ID 저장

    const eventData = info.event.extendedProps.eventData;

    const detailPlan = document.getElementById("detail-plan");
    const deletePlan = document.getElementById("delete-plan");
    const reload = document.getElementById("reload");
    deletePlan.style.display = "block";
    reload.style.display = "block";

    if (eventData) {
      detailPlan.innerHTML = "<div>";
      detailPlan.innerHTML += `
        <p> 타이틀 : ${eventData.eventTitle}</p>
        <p> 일정: ${formatDate(info.event.start)}</p>
        <li> 오늘 먹은 음식: ${eventData.todayFood}</li>
        <li> 오늘 섭취한 칼로리: ${eventData.kcalToday}</li>
        <li> 오늘 진행한 운동: ${eventData.fitToday}</li>
        <li> 오늘 소모한 칼로리: ${eventData.kcalFit}</li>
        <li> 내일 섭취할 식단: ${eventData.tomorrowFood}</li>
        <li> 내일 진행할 운동: ${eventData.tomorrowFit}</li>
        <br><br>
      `;
    } else {
      detailPlan.innerHTML = "<p>해당 날짜에 데이터가 없습니다.</p>";
    }
  });

  // 입력한 데이터 가져오는 로직
  const currentYearMonth = new Date();
  currentYM = `${currentYearMonth.getFullYear()}-${(
    currentYearMonth.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  const userId = localStorage.getItem("UserId");

  // 쿼리 매개를 정의하는 거니까 백틱으로 정의해줘야하고 템플릿 리터럴은 궁극적으로
  // 변수나 표현식을 문자열에 넣기 위함임..
  fetch(
    `http://localhost:8080/calendar/getCalendarData?currentYM=${currentYM}&userId=${userId}`,
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
        //  currentYM = res.currentYM;
        calendarData = res.result;
        addEvents(res.result);
        console.log("현재 년월:", currentYM);
        console.log(res);
      }
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
});

const calendarEl = document.getElementById("calendar");
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: "dayGridMonth", // 년/월/일 선택 코드
  selectable: true, // 날짜 누를 수 있는지 없는지
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },

  // 더블클릭시에 띄우는 모달에 대한 로직
  // 날짜 선택 select 쪽에서 알아냄 근데 더블클릭하는건 eventClick인데 그 코드로 하면 안댐 질문해야댐
  dateClick: function (info) {
    if (info.jsEvent.detail === 2) {
      dateHandler = new Date(info.dateStr);
      currentYM = `${dateHandler.getFullYear()}-${(dateHandler.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      // currentYM = dateHandler.getFullYear() + "-" + (dateHandler.getMonth() + 1) // 계속 0떠서 걍 +1 함;

      console.log("사용자가 선택한 날짜:", info);
      const modal = document.getElementById("eventModal");
      modal.style.display = "block";
      console.log(currentYM);
    }
  },
});

calendar.render();

// 밖으로 뺐음 로직

// 모달 닫는 로직임
const closeModal = document.getElementById("close");
closeModal.addEventListener("click", function () {
  const modal = document.getElementById("eventModal");
  modal.style.display = "none";
  resetSubmit(); // 새로고침 해주기 (데이터가 남아있지 않게)
});

// 모달 저장 후 로직
document.getElementById("submit").addEventListener("click", function () {
  function calendarFetch() {
    fetch("http://localhost:8080/calendar/loadCalendar", {
      method: "post",
      body: JSON.stringify({
        userId: localStorage.getItem("UserId"),
        clientClickData: currentYM + "-" + dateHandler.getDate(),
        eventTitle: document.getElementById("title-plan").value,
        todayFood: document.getElementById("food-today").value,
        kcalToday: document.getElementById("kcal-today").value,
        fitToday: document.getElementById("fit-today").value,
        kcalFit: document.getElementById("kcal-fit").value,
        tomorrowFood: document.getElementById("tomorrow-food").value,
        tomorrowFit: document.getElementById("tomorrow-fit").value,
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
          const modal = document.getElementById("eventModal");
          Swal.fire("Save Done", "입력하신 정보를 저장했습니다", "success");
          modal.style.display = "none";
          resetSubmit(); // 새로고침하는 시점
        }
      })
      .catch(function (error) {
        console.error("Fetch error:", error);
      });
  }

  Swal.fire({
    title: "Record My Fitness",
    text: "모든 정보를 캘린더에 저장하시겠습니까?",
    icon: "success",
    showCancelButton: true,
    confirmButtonColor: "rgb(119, 110, 250)",
    cancelButtonColor: "rgb(158, 158, 158)",
    confirmButtonText: "저장",
    cancelButtonText: "취소",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      calendarFetch();
      location.reload(true);
    }
  });
});

/* DB 표시에 대한 로직 , sql에 있는걸 클라이언트가 볼 수 있게 듸워주는 로직*/
function addEvents(info) {
  info.forEach((eventData) => {
    const eventDate = new Date(eventData.currentYM);
    const formattedDate = formatDate(eventDate);
    calendar.addEvent({
      id: eventData.eventId,
      title: eventData.eventTitle,
      start: formattedDate,
      textColor: "black",
      className: "custom-event",
      eventData: eventData, // 이벤트에 연결된 데이터 추가
    });
  });
}

// info를 포맷하여 원하는 date형태로 바꾸는 로직임
function formatDate(data) {
  const year = data.getFullYear();
  const month = (data.getMonth() + 1).toString().padStart(2, "0");
  const day = data.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 모달 초기화 함수
function resetSubmit() {
  document.getElementById("food-today").value = "";
  document.getElementById("kcal-today").value = "";
  document.getElementById("fit-today").value = "";
  document.getElementById("kcal-fit").value = "";
  document.getElementById("tomorrow-food").value = "";
  document.getElementById("tomorrow-fit").value = "";
  document.getElementById("title-plan").value = "";
}

// 데이터 삭제 로직
document.getElementById("delete-plan").addEventListener("click", function () {
  if (clickedEventId) {
    Swal.fire({
      title: "Delete Calendar Plan",
      text: "선택한 일정을 삭제할까요?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "rgb(119, 110, 250)",
      cancelButtonColor: "rgb(158, 158, 158)",
      confirmButtonText: "네 삭제하겠습니다",
      cancelButtonText: "아니오",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePlanFetch(clickedEventId);
      }
    });
  }
});

function deletePlanFetch(eventId) {
  fetch("http://localhost:8080/calendar/deleteCalendarData", {
    method: "post",
    body: JSON.stringify({ eventId }), // eventId 로 전송하고 sql 컬럼도 변경한 상황임
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
        Swal.fire("Delete Success", "데이터를 삭제했습니다", "success").then(
          () => {
            calendar.getEventById(eventId).remove(); // 이벤트 제거 핵심코드 꼭 기억할 것!
            location.reload(true);
          }
        );
      } else {
        Swal.fire("실패함", "데이터 삭제에 실패했습니다", "error");
      }
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
}

const reloadButton = document.getElementById("reload");
reloadButton.addEventListener("click", function () {
  location.reload(true);
});

// 헤더 로그아웃 로직

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

let currentYM = ""; // 전역변수 => 2024-01
let dateHandler = null; // 전역변수 => new Date(info.dateStr)


document.addEventListener('DOMContentLoaded', function() { //특정한 이벤트에 반응할수있도록 준비된

  const currentYearMonth = new Date();
  currentYM = `${currentYearMonth.getFullYear()}-${(currentYearMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    // 쿼리 매개를 정의하는거니까 백틱으로 정의해줘야하고 템플릿 리터럴은 궁극적으로
    // 변수나 표현식을 문자열에 넣기 위함임..

     fetch(`http://localhost:8080/getCalendarData?currentYM=${currentYM}`,{
      method: "get",
      headers: {
          "Content-Type": "application/json"
      },
      credentials: "include",
      mode: "cors"
  }).then(function (res) {
      return res.json();
  }).then(function (res) {
      if (res.success) {
          //  currentYM = res.currentYM;
           console.log('현재 년월:', currentYM);
           console.log(res);
      } 
  }).catch(function (error) {
      console.error('Fetch error:', error);
  })
});
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {

      initialView: 'dayGridMonth', // 년/월/일 선택 코드
      selectable: true, // 날짜 누를수있는지 없는지
      headerToolbar : {
        left : 'prev,next today',
        center : 'title',
        right : 'dayGridMonth,timeGridWeek,timeGridDay',
      },
  
      // 날짜 선택 select 쪽에서 알아냄 근데 더블클릭하는건 eventClick인데 그 코드로 하면 안댐 질문해야댐
      dateClick: function(info) {
        if(info.jsEvent.detail === 2) {
        dateHandler = new Date(info.dateStr);
        currentYM = `${dateHandler.getFullYear()}-${(dateHandler.getMonth() + 1).toString().padStart(2, '0')}`;
        // currentYM = dateHandler.getFullYear() + "-" + (dateHandler.getMonth() + 1) // 계속 0떠서 걍 +1 함;
        console.log('사용자가 선택한 날짜:', info);
        const modal = document.getElementById('eventModal');
        modal.style.display = 'block';
        console.log(currentYM);
      }}
    });
  
    calendar.render();
    //밖으로 뺐음 로직

 //모달 닫는 로직임
 const closeModal = document.getElementById('close');
 closeModal.addEventListener('click', function () {
   const modal = document.getElementById('eventModal');
   modal.style.display = 'none';
 });

 document.getElementById("submit").addEventListener("click", function () {
   function calendarFetch() {
  
     fetch("http://localhost:8080/loadCalendar", {
       method: "post",
       body: JSON.stringify({
         clientClickData : currentYM + "-" + dateHandler.getDate(),
         todayFood: document.getElementById("food-today").value,
         kcalToday: document.getElementById("kcal-today").value,
         fitToday: document.getElementById("fit-today").value,
         kcalFit: document.getElementById("kcal-fit").value,
         tomorrowFood: document.getElementById("tomorrow-food").value,
         tomorrowFit: document.getElementById("tomorrow-fit").value
       }),
       headers: {
         "Content-Type": "application/json"
       },
       credentials: "include",
       mode: "cors"
     }).then(function (res) {
       return res.json();
     }).then(function (res) {
       if (res.success) {
         const modal = document.getElementById('eventModal');
         Swal.fire('Save Done', '입력하신 정보를 저장했습니다', 'success');
         modal.style.display = "none";
         resetSubmit(); // 새로고침하는 시점
         
       }

     }).catch(function (error) {
       console.error('Fetch error:', error);
     });
   }

   Swal.fire({
     title: 'Record My Fitness',
     text: '모든 정보를 캘린더에 저장하시겠습니까?',
     icon: 'success',
     showCancelButton: true,
     confirmButtonColor: 'rgb(119, 110, 250)',
     cancelButtonColor: 'rgb(158, 158, 158)',
     confirmButtonText: '저장',
     cancelButtonText: '취소',
     reverseButtons: true,
   }).then((result) => {
     if (result.isConfirmed) {
       calendarFetch();
     }
   });

   function resetSubmit() {
     document.getElementById("food-today").value = "";
     document.getElementById("kcal-today").value = "";
     document.getElementById("fit-today").value = "";
     document.getElementById("kcal-fit").value = "";
     document.getElementById("tomorrow-food").value = "";
     document.getElementById("tomorrow-fit").value = "";
   }
 });








//  function addEvents(info){
//   info.forEach(eventData => {
//     const eventDate = new Date (eventData.currentYM);
//     const formattedDate = formatDate(eventDate);
//     calendar.addEvent({
//       title : eventData.kcalFit,
//       start : formattedDate,
//     })
//   })
//  }
//  function formatDate(data){
//   const year = data.getFullYear();
//   const month = data.getMonth().toString().padStart(2,"0");
//   const day = data.getDate().toString().padStart(2,'0');
//   return  `${year}-${month}-${day}`;
//  }
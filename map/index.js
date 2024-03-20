import { API_URL } from "../const.js";

window.addEventListener("load", function () {
  const token = localStorage.getItem("UserToken");
  const nickname = localStorage.getItem("UserName");
  const loginButton = document.getElementById("log_in_button");
  const mypageButton = document.getElementById("mypage_button");
  const logoutButton = document.getElementById("logout_button");
  const getNickName = document.getElementById("nickname");
  const welcome = document.getElementById("welcome");

  if (token) {
    loginButton.style.display = "none";
    mypageButton.style.display = "none";
    logoutButton.style.display = "block";
    getNickName.textContent = nickname;
    getNickName.style.display = "block";
    welcome.textContent = "님  환영합니다";
    welcome.style.display = "inline";
  } else {
    mypageButton.style.display = "none";
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
    getNickName.style.display = "none";
    welcome.style.display = "none";
  }

  document
    .getElementById("logout_button")
    .addEventListener("click", function () {
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
});

function searchPlaces() {
  const keyword = document.getElementById("keyword").value;
  const area = document.getElementById("area").value;

  const kakaoMapSearch = new kakao.maps.services.Places();
  const query = area + (keyword ? keyword + " " : "");

  if (query.trim() !== "") {
    kakaoMapSearch.keywordSearch(query, placesSearch);
  } else {
    console.log("데이터를 입력하세요");
  }
}

function placesSearch(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    const bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < data.length; i++) {
      displayMarker(data[i]);
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }
    map.setBounds(bounds);
  }
}

function displayMarker(place) {
  const marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(place.y, place.x),
  });

  kakao.maps.event.addListener(marker, "click", function () {
    const information = new kakao.maps.InfoWindow();

    information.setContent(
      '<div style="padding:15px;font-size:12px;font-weight:bold;;">' +
        place.place_name +
        "<br><a href='#' onclick='goToDetail(\"" +
        place.place_name +
        "\")'>가게정보 확인하기</a></div>"
    );
    information.open(map, marker);
  });
}

window.goToDetail = function (placeName) {
  const searchUrl = `https://map.kakao.com/?q=${placeName}`;
  window.open(searchUrl);
};

// 가게의 상세페이지로 이동하는 함수

document.addEventListener("DOMContentLoaded", function () {
  // 검색 기능을 추가할 HTML 요소를 생성합니다
  const keywordWrap = document.getElementById("keywordWrap");

  // 구 선택 셀렉트 박스 생성
  const selectBox = document.createElement("select");
  selectBox.setAttribute("id", "area");
  const areas = [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ];

  for (let area of areas) {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    selectBox.appendChild(option);
  }
  keywordWrap.appendChild(selectBox);

  // 검색 입력창 생성
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("id", "keyword");
  searchInput.setAttribute("placeholder", "샐러드");
  searchInput.value = "샐러드";
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchPlaces();
    }
  });

  // 검색 버튼 생성
  const searchButton = document.createElement("button");
  searchButton.setAttribute("id", "search_button");
  searchButton.innerText = "검색";
  searchButton.addEventListener("click", searchPlaces);

  // 요소를 부모 요소에 추가합니다
  keywordWrap.appendChild(searchInput);
  keywordWrap.appendChild(searchButton);
});

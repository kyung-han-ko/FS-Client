import { API_URL } from "../const.js";

var valid_txt = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
//(알파벳,숫자)@(알파벳,숫자).(알파벳,숫자)

// 비밀번호 유효성 검사에 대한 js코드
// API_URL;

const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");
let resultDiv = document.getElementById("result");

document
  .getElementById("check_password")
  .addEventListener("click", function () {
    const passwordValue = password1.value;
    const passwordConfirmValue = password2.value;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
    const password1check = document.getElementById("password1");
    const password2check = document.getElementById("password2");

    if (passwordRegex.test(passwordValue)) {
      if (passwordValue === passwordConfirmValue) {
        resultDiv.innerHTML = "비밀번호 일치 , 사용가능합니다";
        resultDiv.style.color = "green";
        resultDiv.style.fontWeight = "bold";
      } else {
        resultDiv.innerHTML = "비밀번호가 일치하지 않습니다";
        resultDiv.style.color = "red";
        resultDiv.style.fontWeight = "bold";
        password1check.value = null;
        password2check.value = null;
      }
    } else {
      resultDiv.innerHTML =
        "최소 8자 ~ 최대 16자 , 영어, 숫자 , 특수 문자를 포함해야 합니다.";
      resultDiv.style.color = "blue";
      resultDiv.style.fontWeight = "bold";
      password1check.value = null;
      password2check.value = null;
    }
  });

// 최종 회원가입 버튼 시 정보를 전달하기위한 코드
document.getElementById("signup_button").addEventListener("click", function () {
  const nameValue = document.getElementById("name").value;
  const checkNicknameLength = 10;

  if (nameValue.length > checkNicknameLength) {
    swal("닉네임 오류", "닉네임은 10자 이하여야 합니다.", "warning");
  }

  fetch(`${API_URL}/api/signup`, {
    method: "post",
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password1: document.getElementById("password1").value,
      password2: document.getElementById("password2").value,
      emailNumber: document.getElementById("emailNumber").value,
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
      console.log(res);
      checkSubmit(res);
    });
});

function checkSubmit(res) {
  if (res.success) {
    swal({
      title: "회원가입이 완료되었습니다",
      text: "로그인 페이지로 이동하셔서 로그인을 진행해주세요",
      icon: "success",
    }).then(function () {
      location.href = "../login/index.html";
    });
  } else if (res.result === false) {
    swal(
      "회원가입 실패",
      "입력하지 않은 정보가 있습니다. 확인 후 모두 입력해주세요",
      "warning"
    );
  } else if (res.test === false) {
    swal(
      "비밀번호 오류",
      "비밀번호와 비밀번호 확인이 일치하지 않습니다",
      "warning"
    );
  } else if (res.nickname === false) {
    swal(
      "회원가입 실패",
      "중복된 닉네임이 있습니다. 다른 닉네임을 입력해주세요",
      "warning"
    );
  } else if (res.success === false) {
    swal(
      "회원가입 실패",
      "중복된 회원이 있습니다. 다른 이메일을 입력해주세요",
      "warning"
    );
  }
}

//이메일 전송버튼에 대한 js코드
document.getElementById("emailplease").addEventListener("click", function () {
  fetch(`${API_URL}/api/user/post`, {
    method: "post",
    body: JSON.stringify({
      email: document.getElementById("email").value,
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
      console.log(res);
      if (email.value === "") {
        swal("입력된 정보가 없음", "이메일을 입력해주세요", "info");
      } else if (valid_txt.test(email.value) == false) {
        swal("이메일 전송 실패", "이메일 형식이 올바르지 않습니다", "error");
      } else {
        pleaseBox.style.display = "block";
        swal(
          "이메일 발송이 완료되었습니다",
          "인증번호 확인 후 입력해주세요",
          "success"
        );
      }
    });
});

//최초 이메일을 클라이언트가 작성한 인증번호와 내가 보낸게 맞는지에 대한 js코드
document.getElementById("emailCheckBtn").addEventListener("click", function () {
  fetch(`${API_URL}/api/emailCheck`, {
    method: "post",
    body: JSON.stringify({
      emailNumber: document.getElementById("emailNumber").value,
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
      console.log("넘어가라 제발", res);
      checkSend(res);
    });
});

function checkSend(res) {
  console.log("넘어와라 제발", res);
  if (res.success) {
    swal(
      "이메일 인증 완료",
      "이메일 인증에 성공하였습니다 다음 단계로 이동해주세요",
      "success"
    );
    testBox.style.display = "block";
  } else {
    swal(
      "인증실패",
      "이메일 인증에 실패했습니다 인증번호를 다시 확인하세요",
      "error"
    );
    testBox.style.display = "none";
  }
}

document.getElementById("check_name").addEventListener("click", function () {
  fetch(`${API_URL}/api/checkName`, {
    method: "post",
    body: JSON.stringify({
      name: document.getElementById("name").value,
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
      console.log("넘어가라 제발", res);
      if (!res.nickname) {
        swal("닉네임 사용불가", "중복된 닉네임의 회원이 있습니다", "error");
      } else {
        swal("닉네임 사용가능", "닉네임을 사용하실 수 있습니다", "success");
      }
    });
});

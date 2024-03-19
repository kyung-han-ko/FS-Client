document.getElementById("log_in_button").addEventListener("click", function () {
  fetch("http://localhost:8080/api/login", {
    method: "post",
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
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
        swal({
          title: "로그인 성공",
          text: "FITNESS STATION에 오신걸 환영합니다",
          icon: "success",
        }).then(() => {
          localStorage.setItem("UserToken", res.token);
          //매우중요
          localStorage.setItem("UserId", res.userId);
          localStorage.setItem("UserName", res.userName);
          console.log(res.userId);
          console.log(res.token);
          window.location.href = "/main/index.html";
        });
      } else if (res.result) {
        swal("로그인 실패", "아이디를 정확하게 입력해주세요", "info");
      } else {
        swal("로그인 실패", "아이디 또는 비밀번호 오류입니다", "error");
      }
    });
});

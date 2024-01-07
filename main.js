// window.addEventListener("load", function(){
//     const token = localStorage.getItem("UserToken");
//         if(!token){
//             window.location.href = "./login.html"
//         }
// })

window.addEventListener("load", function(){
    const token = localStorage.getItem("UserToken");
    const loginButton = document.getElementById("log_in_button");
    const mypageButton = document.getElementById("mypage_button");
    const logoutButton = document.getElementById("logout_button")

        if(token){
           loginButton.style.display = "none";
           mypageButton.style.display = "block";
           logoutButton.style.display = "block";
        } else {
            mypageButton.style.display = "none";
            loginButton.style.display = "block";
            logoutButton.style.display = "none"
        }
})

// document.getElementById("logout_button").addEventListener("click", function(){
//     const logoutButton = document.getElementById("logout_button");
//     const token = localStorage.getItem("UserToken");

//     if (token) {
//         alert("로그아웃")
//         localStorage.removeItem("UserToken");
//         logoutButton.style.display = "none";
//     }
// });

document.getElementById("logout_button").addEventListener("click", function(){
    const logoutButton = document.getElementById("logout_button");
    const token = localStorage.getItem("UserToken");

    if (token) {
        Swal.fire({
            title: '정말로 로그아웃 하시겠습니까?',
            text: '다시 되돌릴 수 없습니다. 신중하세요.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '로그아웃',
            cancelButtonText: '취소',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('hi')
                localStorage.removeItem("UserToken");
                logoutButton.style.display = "none";
                Swal.fire('로그아웃', '로그아웃이 성공적으로 완료되었습니다.', 'success');
                //강제로 새로고침하는 코드
                location.reload(true);
            }
        });
    }
});
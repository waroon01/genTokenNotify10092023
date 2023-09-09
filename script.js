const submitBtn = document.getElementById('submit_btn');
const emailInput = document.getElementById('emailinp');
const nameInput = document.getElementById('nameinp');
const blockToken = document.getElementById('blocktoken');
const copyBtn = document.getElementById('copy_btn');
const tokenShow = document.getElementById('tokenshow');
const msgAlt = document.getElementById("almsg")
blockToken.style.display = "none";


copyBtn.onclick = function() {
  var text = tokenShow.innerText;
  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = text;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
};


submitBtn.addEventListener("click", (event) => {
  event.preventDefault()
  if(emailInput.value !== "" && nameInput.value !== ""){
      localStorage.setItem("emailUser", emailInput.value)
      localStorage.setItem("nameUser", nameInput.value)
      
      genTokenNotify()    
  }else{
    msgAlt.innerText = "ป้อนอีเมลล์และชื่อของคุณ..."
  } 
})

//ส่งค่าต่างๆ เพื่อไปขอ code 
function genTokenNotify() {

  var URL = "https://notify-bot.line.me/oauth/authorize?";
  URL += "response_type=code";
  URL += "&client_id=xxxxxxxxxxxxxxxxx";  //นำ client id ที่ได้จากการลงทะเบียนแล้วมาใส่่หลัง =
  URL += "&redirect_uri=xxxxxxxxxxxxxxxxxxxxxxxxxxxx"; //นำ url replit ที่จะให้ redirect มาใส่ที่หลัง = 
  URL += "&scope=notify";
  URL += "&state=xxxxxxxxxxxxxxxxxxxx"; //ใส่อีเมลล์หลัง = 
  console.log(URL)
  window.location.href = URL;
}


//on load เมื่อเปิดหน้า เวป แล้ว จะให้ทำงานอะไรต่อ
window.addEventListener("load", (event) => {
  requestLineNotifyToken();

});

//หลังจากเปิดหน้าเวปแล้ว ให้ส่งค่าต่างๆ ไปที่ ชีตพร้อมกับ ส่ง request ไปขอ token แจ้งเตือนจาก appscript
async function requestLineNotifyToken() {
  const urlParams = new URLSearchParams(window.location.search);
  window.history.pushState({}, document.title, "/") //ซ่อน param
  if (urlParams.get("code")) {
    msgAlt.innerText = "รอสักครู่..."
    blockmail.style.display = "none";
    blockname.style.display = "none";
    submitBtn.style.display = "none";
    let codegen = "" + urlParams.get("code");
    console.log(codegen)
    const lineemail = localStorage.getItem("emailUser")
    const linename = localStorage.getItem("nameUser")
    
    console.log(lineemail)
    let obj = {}
    obj.code = codegen
    obj.nameUser = linename
    obj.emailUser = lineemail
    const resfetch = await fetchData(obj) //สั่งรัน ฟังก์ชั่น fetchData ไปที่ appscript พร้อมส่ง object ที่มี อีเมลล์และชื่อ
    console.log("ตรงนี้", resfetch)
    document.getElementById("tokenshow").innerText = resfetch.tokenLine
    blockToken.style.display = "block";
    msgAlt.innerText = "กรุณาคัดลอก id token เพื่อใช้งานต่อไป..."


  } else {
    // alert("no")
  }


}

//function fetcdata
const fetchData = (async (obj) => {

  //นำลิงค์ที่ dploy จาก appscript มาใส่แทนของเดิมนี้
  const url = "https://script.google.com/macros/s/AKfycbyK4_THE_dSInxcJ-lysQDFJov3hFps0FanX_8tKuTKRpIF2xP-tJ8bVbyJF8cDM1T6oQ/exec"

  const formData = new FormData();
  formData.append('objs', JSON.stringify(obj))
  
  const response = await fetch(url + "?type=genToken", {
    method: 'POST',
    body: formData
  })
  
  const json = await response.json()
  // const result = JSON.stringify(json)
  const tokenRes = json.tokenLine
  localStorage.removeItem("emailUser")
  localStorage.removeItem("nameUser")
  return json

})

//ฟังก์ชั่นใช้ในการ revoke token หรือ ยกเลิก token หลังจากกดปุ่ม ยกเลิกรับการแจ้งเตือน
async function cancleToken(){
    const { value: password } = await Swal.fire({
    title: 'Enter your password',
    input: 'password',
    inputLabel: 'Password',
    inputPlaceholder: 'Enter your password',
    inputAttributes: {
      maxlength: 15,
      autocapitalize: 'off',
      autocorrect: 'off'
    }
  })

  if (password) {
    //นำลิงค์ที่ dploy จาก appscript มาใส่แทนของเดิมนี้
    const url = "https://script.google.com/macros/s/AKfycbyK4_THE_dSInxcJ-lysQDFJov3hFps0FanX_8tKuTKRpIF2xP-tJ8bVbyJF8cDM1T6oQ/exec"
    let obj = {}
        obj.password = password
    const formData = new FormData();
    formData.append('objs', JSON.stringify(obj))
    const response = await fetch(url + "?type=revokeToken", {
      method: 'POST',
      body: formData
    })
    const json = await response.json()
    const status = json.status
    console.log(status)

    Swal.fire(`ยกเลิกบริการ line แจ้งเตือนเรียบร้อย`)
    //นำลิงค์ที่จะให้ redirect กลับไปเมื่อยกเลิกสำเร็จมาใส่ตรงนี้ แทนของเดิม (url replit)
    window.open("xxxxxxxxxxx ใส่ url xxxxxxxxxxxxx", "_self");
    return json
  }
}
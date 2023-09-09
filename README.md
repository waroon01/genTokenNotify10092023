# Create webapp generate           Token  Line notify for dynamic 1 to 1 or 1 to any

![enter image description here](https://res.cloudinary.com/gukkghu/image/upload/v1694158235/%E0%B8%AD%E0%B8%B2%E0%B8%88%E0%B8%B2%E0%B8%A3%E0%B8%A2%E0%B9%8C%E0%B9%80%E0%B8%81%E0%B9%8B_yveuuz.png)


webapp ที่ใช้ในการ generate token line notify หรือ line แจ้งเตือน โดยอาศัยหลักการ request api เพื่อ authorization code โดยจะมีการเก็บข้อมูลผู้ใช้งานทั้งส่วนของอีเมลล์ ชื่อเล่น และสำคัญที่สุดคือเราจะได้ token สำหรับแจ้งเตือนอีกด้วย โดยการออก token นี้ ผู้ที่ใช้งาน webapp ของเราจะเป็นผู้ดำเนินการเลือกห้องแชท สำหรับเลือกรับการแจ้งเตือนได้ทั้ง 1:1 หรือ แบบกลุ่มก็ได้ตามแต่ผู้ใช้ต้องการ แตกต่างจากการออก Token ทั่วไปที่ใช้บริการบน [line notify console](https://notify-bot.line.me/th/) 

แต่เราจะใช้การออก token ผ่าน วิธีการ fetch api ซึ่งจะทำให้เราสามารถนำผู้ใช้งานไปที่หน้าเวปของเราพร้อมกับเก็บ token ที่ผู้ใช้ generate ได้ มาทำการแจ้งเตือนส่งข่าวสารต่าง ๆ ต่อได้ด้วย

ในการทำ webapp นี้เราจะใช้ google sheet เป็นที่เก็บข้อมูล user และจะใช้คำสั่ง ของ google appscript คือ [Class UrlFetchApp](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app?hl=th)ในการ ส่ง request และ รับ response แทนฝั่ง front end เพื่อหลีกเลี่ยงปัญหา CORE Origin ได้ พร้อมทั้งสามารถเก็บข้อมูลลงในใน google sheet ที่เรากำหนดให้เป็น API ฐานข้อมูลของเรา

## Download File
1. สำเนา [google sheet](https://docs.google.com/spreadsheets/d/1wxeDZCrkdQWH30KmTtvUvO6XNjAqIjVk9Xl3VyMopVg/copy) 
2. [ดาวน์โหลด File ทั้งหมด](https://github.com/waroon01/genTokenNotify10092023)


## content index
- [ลงทะเบียนรับบริการ](#%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A5%E0%B8%87%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3-line_notify)
 - [การแก้ไข Script ในส่วน app script](#%E0%B9%81%E0%B8%81%E0%B9%89%E0%B9%84%E0%B8%82-code-%E0%B8%9D%E0%B8%B1%E0%B9%88%E0%B8%87-back-end-%28google%20appscript%29)
- [การแก้ไข Code ฝั่ง front end](#%E0%B9%81%E0%B8%81%E0%B9%89%E0%B9%84%E0%B8%82-code-%E0%B8%9D%E0%B8%B1%E0%B9%88%E0%B8%87-front-end) 
- [ตัวอย่าง script แจ้งเตือนแบบต่างๆ](#%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87-appscript-%E0%B9%81%E0%B8%88%E0%B9%89%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%A0%E0%B8%97%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%86)
- [คำอธิบายเพิ่มเติม](#%E0%B8%AD%E0%B8%98%E0%B8%B4%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%A1)

## ขั้นตอนการลงทะเบียนรับบริการ line_notify

เข้า [ลิงค์ลงทะเบียนเพื่อเปิดรับบริการ line notify](https://notify-bot.line.me/th/) login ให้เรียบร้อย 

 1. คลิกเลือกที่แถบด้านบนที่มีชื่อโปรไฟล์เรา
 2. เลือก "การจัดการบริการที่ลงทะเบียน"
 3. เลื่อนหา ปุ่ม "ลงทะเบียนรับบริการ"
 4. กรอกข้อมูลเบื้องต้นให้ครบ (email กรุณาใช้ที่เราจำ password ได้)
 5. กดตกลงดำเนินการต่อ ระบบ จะส่ง email มาให้เรากดยืนยันที่ email ที่เราระบุไว้ตอนลงทะเบียน
 6. หลังจากยืนยัน ใน email แล้ว เราจะเห็น client id และ client secret ที่เราจะนำมาใช้ในขั้นตอนการแก้ไข code
 
 

## แก้ไข code ฝั่ง front end

หากคัดลอกไฟล์ของเราไปใช้ในการทดสอบ จะประกอบไปด้วย 3 ไฟล์ ได้แก่ 
- index.html
- script.js
- style.css
- 
**ส่วนที่ต้องแก้ไข จะเข้าไปแก้ไข ที่ไฟล์ script.js  จุดที่ต้องแก้ไขได้แก่**
1. function genTokenNotify() นำสิ่งเหล่านี้มาวาง แทน xxxx...
2. บรรทัดที่ 39 นำ client id มาวางแทน
3. บรรทัดที่ 40 นำ url ที่ใช้ หรือหากทำตามคลิปสอน ก็คือ url replit นั่นเอง มาวางแทน
4. บรรทัดที่ 42 นำ email ที่เราลงทะเบียนไว้ มาวางแทน
5. function fetchData() ให้นำลิงค์ url ที่ได้จากการ dploy appscript มาใส่แทนของเดิมที่บรรทัดที่ 91
6.  function cancleToken() ให้นำลิงค์ url ที่ได้จากการ dploy appscript มาใส่แทนของเดิมที่บรรทัดที่ 126 
7. function cancleToken() ส่วนของการ redirect ที่คำสั่ง window.open นำ url ที่ใช้ หรือหากทำตามคลิปสอน ก็คือ url replit  มาใส่แทน xxxxx
8. ทำการบันทึกให้เรียบร้อย

## แก้ไข code ฝั่ง back end (google appscript)

1. ทำสำเนา [google sheets ที่ได้รับ](https://docs.google.com/spreadsheets/d/1wxeDZCrkdQWH30KmTtvUvO6XNjAqIjVk9Xl3VyMopVg/copy) 
2. เข้าไปแก้ไข appscript 
3. บรรทัดที่ 4 เปลี่ยน id sheets ที่ตัวแปล IDSHEET
4. บรรทัดที่ 71 นำลิงค์ที่ลงทะเบียนไว้ก่อนหน้าที่หรือสร้างขึ้น (index.html) มาวางเพื่อให้ redirect มาที่หน้า web 
5. บรรทัดที่ 72 นำ client_id ที่ได้จากการลงทะเบียนมาใส่แทน xxxx...
6. บรรทัดที่ 73 นำ client secret ที่ได้จากการลงทะเบียนมาใส่แทน xxxx...
7. จัดการทำให้ใช้งานได้ หรือ dploy **(ทุกครั้งที่แก้ไข script แล้ว จะต้องทำ dploy ทุกครั้ง)**

#### รูปแบบคอมลัมน์ใน google sheets

จัดวางคอลัมน์ให้สอดคล้องกับ script
- col 1 วันเดือนปี
- col 2 name
- col 3 token
- col 4 email
- col 5 id

## ตัวอย่าง appscript แจ้งเตือนประเภทต่างๆ

#### ตัวอย่างรูปแบบฟังก์ชั่น app script ใช้ในการส่ง line notify ข้อความอย่างเดียว
```javascript  
function  sendNotiToLine_textMessage(){
	let token = "นำ Token มาใส่ที่นี่"
	try{
		var  formData = {'message' : "ใส่ข้อความตรงนี้ หากอยากขึ้นบรรทัดใหม่ให้ใส่ \n",}
		var  options ={
		"method" : "post",
		"payload" : formData, // message, imageFile, formData, Post
		"headers" : {"Authorization" : "Bearer "+ token}
		};
		let  response = UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
		Logger.log(response.getContentText())
	}catch(error){
		Logger.log("EROR! "+error)
	}
} ```

```
#### ตัวอย่าง รูปแบบฟังก์ชั่น app script ใช้ในการส่ง line notify (ข้อความพร้อมรูปภาพ ที่แนะนำ)
```javascript  
function  sendNotiToLineImage(){
	let msg = "ส่งข้อความของฉัน"
	let imgLine= "https://mpics.mgronline.com/pics/Images/564000013227702.JPEG"
	let token = "นำ Token มาใส่ที่นี่"
	try {
		var  formData = {
		'message' : msg,
		"imageFile": imgLine,
		}
		var  options =
		{
		"method" : "post",
		"payload" : formData,
		"headers" : {"Authorization" : "Bearer "+ token}
		};
		let  response = UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
		Logger.log(response.getContentText())
	}catch(err){
	Logger.log("EROR! > " + err)
	}
}
```
#### ตัวอย่าง รูปแบบฟังก์ชั่น app script ใช้ในการส่ง line notify (ข้อความพร้อมรูปภาพ และ sticker )
```javascript  
function  sendNotiToLineImage(){
	let msg = "ส่งข้อความของฉัน"
	let token = "นำ Token มาใส่ที่นี่"
	try {
		var  formData = {
		'message' : msg,
		'stickerPackageId': "446",
		'stickerId':"1988",
		}
		var  options =
		{
		"method" : "post",
		"payload" : formData,
		"headers" : {"Authorization" : "Bearer "+ token}
		};
		let  response = UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
		Logger.log(response.getContentText())
	}catch(err){
	Logger.log("EROR! > " + err)
	}
}
```
## อธิบายเพิ่มเติม

- โปรเจคต์นี้ มีการนำ ไลบรารี่ [Betterlog](https://github.com/peterherrmann/BetterLog) มาใช้ในส่วน appscript เพื่อจัดการติดตามข้อผิดพลาด
- การนำไปประยุกต์ใช้ควรที่จะมีการสอบถามหรือตั้งข้อตกลงผ่าน (consent form)เนื่องจากอาจเป็นการละเมิดสิทธิ์ ในส่วนของการออก Token 
- หากประยุกต์ใช้จริงควรมีการจัดทำคู่มือให้ผู้ใช้งานทราบว่าควรเลือกห้องสนทนาใดในการรับการแจ้งเตือน

## ผู้เขียนและพัฒนา

 พัฒนาโดย นายวรุณพร รัตนบุตรชัย เรียบเรียงและจัดทำเพื่อเผยแพร่ให้กับผู้ที่สนใจเรียนรู้ประยุกต์ใช้ในส่วนของการรับบริการของ Line Notify API อนุญาตนำไปใช้ในทางสุจริต และ ชอบด้วยกฎหมาย เท่านั้น 

***การจัดสอนของผมมิได้มีเจตนาเชิงการค้าเพื่อให้เกิดประโยชน์ในทางมั่งคั่ง แต่อย่างใดเพียงแต่ทุกการสนับสนุนจากทุกท่าน ผมจะใช้เพื่อพัฒนาตนเอง ในเชิงการสอนรวมถึงการสรรหาความรู้เพิ่มเติมเพียงเท่านั้น*** 

**ขอขอบคุณ อาจารย์สมพงษ์ โพคาศรี โรงเรียนหนองกราดวัฒนา จังหวัด นครราชสีมา ที่เอื้อเฟื้อความรู้ อนุเคราะห์ และ ให้โอกาสมาโดยตลอด**
 
***ท่านสามารถ สนับสนุนการเรียนรู้ได้ ที่ พร้อมเพย์ 0817410181  หรือ สนับสนุนด้วยการนำไปให้เกิดประโยชน์ต่อเยาวชนและประเทศชาติ ต่อไป 
ขอบคุณด้วยใจจริงทุกการสนับสนุน*** 




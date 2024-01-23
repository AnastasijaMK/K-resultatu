<?php
$fio = $_POST['fio'];
$phone = $_POST['phone'];
$fio = htmlspecialchars($fio);
$phone = htmlspecialchars($phone);
$fio = urldecode($fio);
$phone = urldecode($phone);
$fio = trim($fio);
$phone = trim($phone);
//echo $fio;
//echo "<br>";
//echo $phone;
if (mail("anastasija.nk@yandex.ru", "Заявка с сайта", "ФИО:".$fio.". Телефон: ".$phone ,"From: example2@mail.ru \r\n")) {
    echo "сообщение успешно отправлено";
    $result['success'] = true;
    echo  json_encode($result);
} else {
    echo "при отправке сообщения возникли ошибки";
    $result['success'] = false;
    echo  json_encode($result);
}
?>
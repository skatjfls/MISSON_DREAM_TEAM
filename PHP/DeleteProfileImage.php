<?php
include('index.php');

if(!session_id()){
    session_start();
}

if (!isset($_SESSION['id'])) {
    echo json_encode(array('error' => '로그인이 필요합니다.'));
    exit;
}else{
    $id = $_SESSION['id'];
}

        try{
            $sql = "SELECT profileImage FROM member WHERE id = ?";
            $stmt = $db->prepare($sql);
            $stmt->bind_param('s', $id);
            $stmt->execute();
            $result = $stmt->get_result();

            while($row = $result->fetch_assoc()){
                $photo = $row['profileImage'];
                if($photo != null){
                    $filePath = $photo;
                    if(file_exists($filePath)){
                        unlink($filePath);
                    }
                }
            }
        $profile_path = "/img/default_profile.png";

echo $profile_path;
        }catch(Exception $e){
            echo json_encode(array('error' => '이전 이미지 삭제 중 오류가 발생하였습니다.'));
            exit;
        }
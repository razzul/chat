<?php
if(isset($_POST['date']) && $_POST['date'] != '' && $_POST['img'] && $_POST['img'] != '' && $_POST['text'] && $_POST['text'] != '' && $_POST['username'] && $_POST['username'] != '' && $_POST['email'] && $_POST['email'] != ''){
    
    $date = $_POST['date'];
    $img = $_POST['img'];
    $text = $_POST['text'];
    $username = $_POST['username'];
    $email = $_POST['email'];

    $fp = fopen("log.json", 'a');
    $data = array(
        'date' => $date,
        'text' => $text,
        'username' => $username,
        'email' => $email,
        'img'  => stripslashes(htmlspecialchars($img)),
    );
    fwrite($fp, ','.json_encode($data));
    fclose($fp);
} else if(isset($_POST['is_login']) && $_POST['is_login'] != '' && isset($_POST['email']) && $_POST['email'] != '' && !isset($_POST['username'])){
    $post_email = $_POST['email'];
    $exist = 'false';
    if(file_exists("email.json") && filesize("email.json") > 0){
        $handle = fopen("email.json", "r");
        $contents = fread($handle, filesize("email.json"));
        fclose($handle);

        $emails = json_decode('['.$contents.']');
        if(!empty($emails)){
            foreach($emails as $email){
                if($email->email == $post_email) $exist = 'true';
            }
        }
    }
    echo json_encode($exist);
} else if(isset($_POST['is_login']) && $_POST['is_login'] != '' && isset($_POST['email']) && $_POST['email'] != '' && isset($_POST['username']) && $_POST['username'] != ''){
    $post_username = $_POST['username'];
    $post_email = $_POST['email'];
    $exist = 'false';
    if(file_exists("username.json") && filesize("username.json") > 0){
        $handle = fopen("username.json", "r");
        $contents = fread($handle, filesize("username.json"));
        fclose($handle);

        $usernames = json_decode('['.$contents.']');
        if(!empty($usernames)){
            foreach($usernames as $username){
                if($username->username == $post_username) $exist = 'true';
            }
        }
    }
    
    if($exist == 'false'){
        $fp = fopen("email.json", 'a');
        fwrite($fp, ','.json_encode(array('email' => $post_email)));
        fclose($fp);

        $fp = fopen("username.json", 'a');
        fwrite($fp, ','.json_encode(array('username' => $post_username,)));
        fclose($fp);
    }
    echo json_encode($exist);
} else if(isset($_POST['is_updated']) && $_POST['is_updated'] != null && isset($_POST['type']) ){
    if($_POST['type'] == 'post'){
        $is_updated = $_POST['is_updated'];
        $is_updated += 1;
        file_put_contents('update.json', json_encode(array('is_updated'=>$is_updated)));
        echo $is_updated;
    } else if($_POST['type'] == 'get'){
        if(file_exists("update.json") && filesize("update.json") > 0){
            $handle = fopen("update.json", "r");
            $contents = fread($handle, filesize("update.json"));
            fclose($handle);
            $contents = json_decode($contents);
        }
        echo $contents->is_updated;
    }
}
<?php
require ('sqlinclude.php');
$action = $_GET["action"];
$id = $_GET["id"];
$givenAnswer = $_GET["givenAnswer"];
$name = $_GET["name"];
$score = $_GET["score"];

switch($action) {
    case 'getQuestion':
	$sql = "SELECT id, question, options, image  FROM quiz";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0) {
		// output data of each row
		$jsonData = array();
		$count = 0;
		while ($row = mysqli_fetch_assoc($result)) {
			$jsonData[$count] = $row;
			$count++;
		}
		echo json_encode($jsonData);
	} else {
		echo "0 results";
	}
	break;
	case 'checkAnswer':
	$sql = "SELECT * FROM quiz WHERE id='$id'";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0) {
		$row = $result->fetch_assoc();
		if($givenAnswer == $row['answer']) {
			$correct="true";
		}else{
			$correct="false";			
		}
		$post_data = array(
  			'correct' => $correct,
    		'rightAnswer' => $row['answer']
    	);	
    	echo json_encode($post_data);
	} else {
		echo "0 results";		
	}
	break;
	case 'submitScore':
		$sql = "INSERT INTO quizscore (name, score) VALUES ('$name', $score)";
	    if (mysqli_query($conn, $sql)) {
	        echo mysqli_insert_id($conn);
	    } else {
	        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
	    } 
	break;
	case 'showScores':
		$sql = "SELECT * FROM quizscore ORDER BY id DESC LIMIT 6";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0) {
		// output data of each row
		$jsonData = array();
		$count = 0;
		while ($row = mysqli_fetch_assoc($result)) {
			$jsonData[$count] = $row;
			$count++;
		}
		echo json_encode($jsonData);
	} else {
		echo "0 resultssss";
	}
	break;
}
mysqli_close($conn);
?>
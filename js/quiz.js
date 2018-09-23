var quizapp = new Vue({
	el : '#quizapp',
	data : {
		quizdata : [],
		questionNum : 0,
		numQuestions : 0,
		score: 0,
		clickedIndex : 0,
		rightAnswer: 0,
		show: true,
		feedback : false,
		answerIsRight: false,
		completed: false,
		submitted: false,
		userName: "",
		scores: []	
		},
	computed: {
		//the answer options is a string, convert it to array
		splitOptions: function () {
			return this.quizdata[this.questionNum].options.split(',');
		}
	
	},
	methods:{
		checkAnswer: function (index) {
			this.clickedIndex = index;//save it for coloring the options
			self = this;
			this.feedback = true;
			$.getJSON("http://www.leeuwdesign.nl/quiz/backend/quiz.php",{ action: "checkAnswer", id: this.quizdata[this.questionNum].id, givenAnswer: index }, function(json) {
				self.rightAnswer = json.rightAnswer;
				if(json.correct == "true") {
					self.answerIsRight = true;
					self.score++;	
				}		
			});
		},
		nextQuestion: function () {
			this.feedback = false;
			this.show = false;
			this.answerIsRight = false;
			if(this.questionNum < this.numQuestions - 1){
				self.questionNum++;	
				self.show = true;						
			}else{
				this.completed = true;
			}
		},
		colorOptions: function (index) {
			if(this.feedback) {
				if(index == this.rightAnswer)	{
					//color the right answer green
					return 'rightanswer disabled';
				}else if(index == this.clickedIndex){
					//color the wrong answer red
					return 'wronganswer disabled';
				}else{
					//disable them all during feedback
					return 'disabled';
				}
			}else{
				//normal state
				return 'prefeedback';
			}
		},
		submitScore: function (event) {
			this.userName = $("#username-field").val();
			this.submitted = true;
			self = this;
				$.getJSON("http://www.leeuwdesign.nl/quiz/backend/quiz.php",{ action: "submitScore", name: this.userName, score: this.score  }, function(json) {
					self.showScores();
			});
		},
		showScores: function (event) {
			self = this;
			$.getJSON("http://www.leeuwdesign.nl/quiz/backend/quiz.php",{ action: "showScores" }, function(json) {
					self.scores = json;					
			});
		}								
	},
	created() {
		//load the data
		self = this;
		$.getJSON("http://www.leeuwdesign.nl/quiz/backend/quiz.php",{ action: "getQuestion" }, function(json) {
			self.quizdata = json;
			self.numQuestions = Object.keys(json).length;					
		});
	}
});
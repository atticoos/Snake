<?php include("../header.php"); ?>

<link rel="stylesheet" type="text/css" href="snake.css" />
	
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<h2>Snake</h2>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-10">
			
				<canvas id="snake"></canvas>
			</div>
			<div class="col-xs-2">
				<div>
					<h4>Score</h4>
					<span id="score"></span>
				</div>
				<div>
					<h4>Timer</h4>
					<span id="timer"></span>
				</div>
			</div>
		</div>	
	</div>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="snake.js"></script>
<?php include("../footer.php"); ?>
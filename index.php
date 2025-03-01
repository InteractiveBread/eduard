<!DOCTYPE html>
<?php
	$info = json_decode(
		file_get_contents(
			'info.json'
		), true
	);
?>
<html lang="de">
	<head>		
		<title></title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="style.css?v=<?php echo filemtime('style.css'); ?>">
	</head>
	<body>
		<header>
			<img src="eduard.svg" title="Eduard">
			<p>
				<b>E</b>rweitertes <b>D</b>ispo- <b>u</b>nd <b>A</b>rbeitszeiten<b>r</b>echner<b>d</b>ings
			</p>
		</header>
		<main>
			<div class="wrapper">
				<div class="settings">
					<div class="salary">
						<h3>Gage</h3>
						<label for="salary_select">Auswahl nach Berufsbezeichnung:</label>
						<select name="salary_select"></select>
						<p class="mute">
							<i>(Nach Gagentabelle TV FFS - gültig bis <b>30.04.2025</b>)</i>
						</p>
						<label for="salary_input">Freie Eingabe:</label>
						<input type="number" name="salary_input">
					</div>
					<div class="date"></div>
				</div>
				<div class="days">
					<!-- filled by JS -->
				</div>
				<div class="calculation"></div>
			</div>
		</main>
		<footer>
			Eduard <?php echo $info['version']; ?><br>
			<?php
				foreach ($info['links'] as $key => $link) {
					echo '<a href="', $link['url'], '" title="', $link['title'], '" target="_blank">', $link['label'], '</a><br>';
				}
			?>
			<i>Interactive Bread, 2025</i>
		</footer>
		<script src="constants.js?v=<?php echo filemtime('constants.js'); ?>"></script>
		<script src="eduard.js?v=<?php echo filemtime('eduard.js'); ?>"></script>
	</body>
</html>

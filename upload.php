<?php
$expected = date('dmY');

// Nedlasting
if (isset($_GET['download'])) {
    $file = __DIR__ . '/varer.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="varer.csv"');
    readfile($file);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (($_POST['password'] ?? '') !== $expected) {
        $error = "Feil passord";
    } elseif (!isset($_FILES['csv'])) {
        $error = "Ingen fil valgt";
    } else {
        $tmp = $_FILES['csv']['tmp_name'];
        if (pathinfo($_FILES['csv']['name'], PATHINFO_EXTENSION) !== 'csv') {
            $error = "Kun CSV tillatt";
        } else {
            $target = __DIR__ . '/varer.csv';
            if (file_exists($target)) {
                copy($target, __DIR__ . '/varer_backup_' . date('Ymd_His') . '.csv');
            }
            move_uploaded_file($tmp, $target);
            $success = "varer.csv er oppdatert";
        }
    }
}
?>
<!doctype html>
<html lang="no">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Oppdater varer.csv</title>
<style>
body { font-family: system-ui, sans-serif; margin: 40px; max-width: 520px; }
input, button { width: 100%; padding: 10px; margin-top: 10px; }
.box { border:1px solid #ddd; border-radius:12px; padding:16px; margin-bottom:20px; }
.err { color:#b00020; }
.ok { color:#006400; }
</style>
</head>
<body>

<h1>Oppdater varer.csv</h1>

<div class="box">
  <a href="?download=1">Last ned nåværende varer.csv</a>
</div>

<div class="box">
<form method="post" enctype="multipart/form-data">
  <input type="password" name="password" placeholder="Dagens passord (DDMMÅÅÅÅ)" required>
  <input type="file" name="csv" accept=".csv" required>
  <button type="submit">Last opp</button>
</form>

<?php if (!empty($error)): ?><div class="err"><?= htmlspecialchars($error) ?></div><?php endif; ?>
<?php if (!empty($success)): ?><div class="ok"><?= htmlspecialchars($success) ?></div><?php endif; ?>
</div>

<p><a href="index.html">← Tilbake til søk</a></p>

</body>
</html>

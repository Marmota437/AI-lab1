<?php
/** @var \App\Model\Note $note */
/** @var \App\Service\Router $router */

$title = 'Tworzenie Notatki';
$bodyClass = 'edit';

ob_start(); ?>
    <h1>Tworzenie nowej notatki</h1>

    <form action="<?= $router->generatePath('note-create') ?>" method="post" class="edit-form">
        <label for="title">Tytuł</label>
        <input type="text" id="title" name="title" value="<?= $note->getTitle() ?>">

        <label for="body">Treść</label>
        <textarea id="body" name="body"><?= $note->getBody() ?></textarea>

        <input type="submit" value="Zapisz">
    </form>

    <a href="<?= $router->generatePath('note-index') ?>">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
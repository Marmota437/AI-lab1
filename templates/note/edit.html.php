<?php
/** @var \App\Model\Note $note */
/** @var \App\Service\Router $router */

$title = 'Edycja Notatki: ' . $note->getTitle();
$bodyClass = 'edit';

ob_start(); ?>
    <h1>Edycja notatki</h1>

    <form action="<?= $router->generatePath('note-edit', ['id' => $note->getId()]) ?>" method="post" class="edit-form">
        <label for="title">Tytuł</label>
        <input type="text" id="title" name="title" value="<?= $note->getTitle() ?>">

        <label for="body">Treść</label>
        <textarea id="body" name="body"><?= $note->getBody() ?></textarea>

        <input type="submit" value="Zapisz zmiany">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('note-index') ?>">Powrót do listy</a>
        </li>
        <li>
            <form action="<?= $router->generatePath('note-delete', ['id' => $note->getId()]) ?>" method="post">
                <input type="submit" value="Usuń" onclick="return confirm('Czy na pewno chcesz usunąć?')">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
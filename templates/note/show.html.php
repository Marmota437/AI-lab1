<?php
/** @var \App\Model\Note $note */
/** @var \App\Service\Router $router */

$title = $note->getTitle();
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $note->getTitle() ?></h1>

    <article>
        <?= $note->getBody() ?>
    </article>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('note-index') ?>">Powrót do listy</a>
        </li>
        <li>
            <a href="<?= $router->generatePath('note-edit', ['id' => $note->getId()]) ?>">Edytuj</a>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
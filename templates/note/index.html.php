<?php
/** @var \App\Model\Note[] $notes */
/** @var \App\Service\Router $router */

$title = 'Lista Notatek';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Lista Notatek</h1>

    <a href="<?= $router->generatePath('note-create') ?>">Utwórz nową</a>

    <ul class="index-list">
        <?php foreach ($notes as $note): ?>
            <li>
                <h3><?= $note->getTitle() ?></h3>
                <ul class="action-list">
                    <li>
                        <a href="<?= $router->generatePath('note-show', ['id' => $note->getId()]) ?>">Szczegóły</a>
                    </li>
                    <li>
                        <a href="<?= $router->generatePath('note-edit', ['id' => $note->getId()]) ?>">Edytuj</a>
                    </li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
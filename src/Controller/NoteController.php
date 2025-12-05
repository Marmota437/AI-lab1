<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Note;
use App\Service\Router;
use App\Service\Templating;

class NoteController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $notes = Note::findAll();
        $html = $templating->render('note/index.html.php', [
            'notes' => $notes,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $note = Note::fromArray($requestPost);
            $note->save();

            $path = $router->generatePath('note-index');
            $router->redirect($path);
            return null;
        } else {
            $note = new Note();
        }

        $html = $templating->render('note/create.html.php', [
            'note' => $note,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $noteId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $note = Note::find($noteId);
        if (! $note) {
            throw new NotFoundException("Missing note with id $noteId");
        }

        if ($requestPost) {
            $note->fill($requestPost);
            $note->save();

            $path = $router->generatePath('note-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('note/edit.html.php', [
            'note' => $note,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $noteId, Templating $templating, Router $router): ?string
    {
        $note = Note::find($noteId);
        if (! $note) {
            throw new NotFoundException("Missing note with id $noteId");
        }

        $html = $templating->render('note/show.html.php', [
            'note' => $note,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $noteId, Router $router): ?string
    {
        $note = Note::find($noteId);
        if (! $note) {
            throw new NotFoundException("Missing note with id $noteId");
        }

        $note->delete();
        $path = $router->generatePath('note-index');
        $router->redirect($path);
        return null;
    }
}
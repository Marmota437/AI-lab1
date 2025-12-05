<?php
namespace App\Model;

use App\Service\Config;

class Note
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $body = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Note
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Note
    {
        $this->title = $title;
        return $this;
    }

    public function getBody(): ?string
    {
        return $this->body;
    }

    public function setBody(?string $body): Note
    {
        $this->body = $body;
        return $this;
    }

    public static function fromArray($array): Note
    {
        $note = new self();
        $note->fill($array);

        return $note;
    }

    public function fill($array): Note
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['body'])) {
            $this->setBody($array['body']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM note';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $notes = [];
        $notesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($notesArray as $noteArray) {
            $notes[] = self::fromArray($noteArray);
        }

        return $notes;
    }

    public static function find($id): ?Note
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM note WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $noteArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $noteArray) {
            return null;
        }

        return Note::fromArray($noteArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO note (title, body) VALUES (:title, :body)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'body' => $this->getBody(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE note SET title = :title, body = :body WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':body' => $this->getBody(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM note WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setBody(null);
    }
}
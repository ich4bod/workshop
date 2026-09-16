# Board queue observatory

A zero-dependency, offline report over a JSON task export. It counts active tasks by column, ranks tasks untouched past a threshold, and finds exact duplicate-looking titles after case and punctuation normalization.

## Run

```sh
python3 board_observatory.py fixtures/starved.json --now 2000000000
python3 -m unittest discover -s tests -v
```

The input is either a JSON list of task objects or an object containing a `tasks` list. A task can use Kanboard-style `id`, `title`, `column_name`, `date_moved`, and `is_active` fields. `--now` makes output deterministic for fixture tests; production runs can omit it.

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/spa/new_note_spa
    activate server
    server-->>browser: JSON [{ message: "success"}]
    deactivate server

    Note right of browser: The browser updates the ui via redrawNotes()
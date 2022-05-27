// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as cp from 'child_process';

let extensionContext: vscode.ExtensionContext;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld-sample" is now active!');

    // assign extension context to global variable
    extensionContext = context;

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        // The code you place here will be executed every time your command is executed

        // Run R executable
        startR();
    });

    context.subscriptions.push(disposable);
}

function startR() {
    const command = 'C:\\woot\\opt\\r\\bin\\R.exe';
    // const command = 'C:\\woot\\opt\\r\\bin\\x64\\R.exe';
    // const command = 'C:\\woot\\opt\\r\\bin\\x64\\Rterm.exe';
    const proc = cp.spawn(command, ["-q", "-e", "Sys.sleep(300)"]);

    vscode.window.showInformationMessage(`Proc started: ${proc.pid}`);

    asDisposable(proc, () => {
        cp.spawnSync('taskkill', ['/pid', proc.pid.toString(), '/f', '/t']);
    });
}

function asDisposable<T>(toDispose: T, disposeFunction: (...args: unknown[]) => unknown): T & vscode.Disposable {
    type disposeType = T & vscode.Disposable;
    (toDispose as disposeType).dispose = () => disposeFunction();
    extensionContext.subscriptions.push(toDispose as disposeType);

    return toDispose as disposeType;
}

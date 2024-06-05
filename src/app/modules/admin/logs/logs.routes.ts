import { Routes } from "@angular/router";
import { LogsComponent } from "./logs.component";
import { getAllLogsResolver } from "./logs.resolver";

export default [
    {
        path: '',
        component: LogsComponent,
        resolve: {
            logs: getAllLogsResolver
        }
    }
] as Routes;


import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { User } from "../../../modules/users/entities/user.entity";

@Entity("bull_jobs_history")
export class BullJobHistory {

    @PrimaryColumn()
    id: string;

    @Column()
    job_id: string;

    @Column()
    name: string;

    @Column()
    attempts_made: string;

    @Column()
    status: string;

    @Column()
    failed_reason: string;

    @Column()
    email_to: string;

    @Column()
    job_type: string;

    @Column()
    affected_tables: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "requester_user_id" })
    requester_user: User;

    @Column()
    started_on: Date;

    @Column()
    processed_on: Date;

    @Column()
    finished_on: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }

}
export type StateLabel = 'Stationary' | 'Transitioning' | 'Degraded';

export interface InvariantResult {
    id: 'Coupling' | 'ScaleSeparation' | 'ThermodynamicMeaning' | 'FailClosed' | 'StationaryFloor';
    passed: boolean;
    reason?: string;
}

export interface StateSeal {
    anchor: string;
    label: StateLabel;
    sequence: number;
    hash: string;
}

export interface TshOutput {
    ok: boolean;
    seal: StateSeal | null;
    failures: InvariantResult[];
}

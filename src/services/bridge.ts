import { TshOutput, InvariantResult, StateSeal } from '../types/riverbraid';

export const computeHash = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const evaluateState = async (
    anchor: string, 
    state: string, 
    sequence: number, 
    previousHash: string
): Promise<TshOutput> => {
    const couplingPassed = anchor.startsWith('0x') && anchor.length >= 8;
    const scalePassed = state.trim().length > 0;
    const sequencePassed = sequence > 0;

    const results: InvariantResult[] = [
        { id: 'Coupling', passed: couplingPassed, reason: couplingPassed ? undefined : 'Invalid Anchor' },
        { id: 'ScaleSeparation', passed: scalePassed, reason: scalePassed ? undefined : 'Empty Substrate' },
        { id: 'StationaryFloor', passed: sequencePassed, reason: sequencePassed ? undefined : 'Sequence Error' },
    ];

    const ok = results.every(r => r.passed);
    const hash = ok ? await computeHash(anchor + state + previousHash + sequence) : '';

    return {
        ok,
        seal: ok ? { anchor, label: 'Stationary', sequence, hash: `0x${hash}` } : null,
        failures: results.filter(r => !r.passed)
    };
};

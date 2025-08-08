import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SSRMakeModel from '../SSRMakeModel';
import * as api from '@/hooks/useVehicleAPI';
import '@testing-library/jest-dom';

jest.mock('@/hooks/useVehicleAPI');

const serverMakes = [
    { Make_ID: 452, Make_Name: 'BMW' },
];

const mockModels = [
    { Make_ID: 452, Make_Name: 'BMW', Model_ID: 1707, Model_Name: '128i' },
];

describe('SSRMakeModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (api.fetchModelsForMake as jest.Mock).mockResolvedValue(mockModels);
    });

    it('renders SSR title', () => {
        render(<SSRMakeModel serverMakes={serverMakes} />);
        expect(screen.getByText(/SSR Vehicle Make & Model Finder/i)).toBeInTheDocument();
    });

    it('fetches and displays models after selecting make', async () => {
        render(<SSRMakeModel serverMakes={serverMakes} />);

        const selectInput = screen.getByLabelText('Select Vehicle Make');
        fireEvent.keyDown(selectInput, { key: 'ArrowDown', code: 'ArrowDown' });

        await waitFor(() => {
            expect(screen.getByText('BMW')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('BMW'));

        fireEvent.click(screen.getByText(/Fetch Models/i));

        await waitFor(() => {
            expect(screen.getByText('128i')).toBeInTheDocument();
        });
    });
});

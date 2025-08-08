import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomePage from '@/app/page';
import { fetchAllMakes, fetchModelsForMake } from '@/hooks/useVehicleAPI';

jest.mock('@/hooks/useVehicleAPI', () => ({
    fetchAllMakes: jest.fn(),
    fetchModelsForMake: jest.fn(),
}));

describe('HomePage CSR', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders Toyota in the make dropdown', async () => {
        (fetchAllMakes as jest.Mock).mockResolvedValue([
            { Make_ID: 1, Make_Name: 'Toyota' },
            { Make_ID: 2, Make_Name: 'Honda' },
        ]);

        render(<HomePage />);

        await waitFor(() => {
            expect(fetchAllMakes).toHaveBeenCalled();
        });

        const selectControl = screen.getByText('Select Make');
        fireEvent.mouseDown(selectControl);

        expect(await screen.findByText('Toyota')).toBeInTheDocument();
    });

    it('fetches and displays models for Toyota', async () => {
        (fetchAllMakes as jest.Mock).mockResolvedValue([
            { Make_ID: 1, Make_Name: 'Toyota' },
        ]);
        (fetchModelsForMake as jest.Mock).mockResolvedValue([
            { Model_ID: 101, Model_Name: 'Corolla', Make_ID: 1, Make_Name: 'Toyota' },
        ]);

        render(<HomePage />);

        await waitFor(() => {
            expect(fetchAllMakes).toHaveBeenCalled();
        });
        fireEvent.mouseDown(screen.getByText('Select Make'));

        fireEvent.click(await screen.findByText('Toyota'));

        fireEvent.click(screen.getByText('Fetch Models'));

        expect(await screen.findByText('Corolla')).toBeInTheDocument();
    });

    it('shows "No models found" if API returns empty', async () => {
        (fetchAllMakes as jest.Mock).mockResolvedValue([
            { Make_ID: 1, Make_Name: 'Toyota' },
        ]);
        (fetchModelsForMake as jest.Mock).mockResolvedValue([]);

        render(<HomePage />);

        await waitFor(() => {
            expect(fetchAllMakes).toHaveBeenCalled();
        });
        fireEvent.mouseDown(screen.getByText('Select Make'));
        fireEvent.click(await screen.findByText('Toyota'));

        fireEvent.click(screen.getByText('Fetch Models'));

        expect(
            await screen.findByText('No models found for the selected make.')
        ).toBeInTheDocument();
    });
});

import { useCallback, useEffect, useState, useContext } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { GlobalContext } from '../context/GlobalState';
import api from '../services/api';
import { Building2 } from 'lucide-react';

const LinkBank = () => {
    const [token, setToken] = useState<string | null>(null);
    const { getAccounts } = useContext(GlobalContext);

    useEffect(() => {
        const createLinkToken = async () => {
            try {
                const response = await api.post('/plaid/create_link_token');
                setToken(response.data.link_token);
            } catch (err) {
                console.error('Error creating link token:', err);
            }
        };
        createLinkToken();
    }, []);

    const onSuccess = useCallback(async (public_token: string, metadata: any) => {
        try {
            await api.post('/plaid/exchange_public_token', {
                public_token,
                metadata,
            });
            // Refresh accounts to show the new linked account
            getAccounts();
        } catch (err) {
            console.error('Error exchanging token:', err);
        }
    }, [getAccounts]);

    const config: Parameters<typeof usePlaidLink>[0] = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <button
            onClick={() => open()}
            disabled={!ready}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Building2 size={20} className="mr-2" />
            Connect Bank
        </button>
    );
};

export default LinkBank;

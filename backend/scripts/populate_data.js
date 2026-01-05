// Using global fetch available in Node 18+
// Actually, let's just use global fetch.

const API_URL = 'http://localhost:5000/api';

const clients = [
    { name: 'Alice Walker', email: 'alice@test.com', password: 'password123', role: 'client' },
    { name: 'Bob Martin', email: 'bob@test.com', password: 'password123', role: 'client' },
    { name: 'Charlie Brown', email: 'charlie@test.com', password: 'password123', role: 'client' },
    { name: 'Diana Prince', email: 'diana@test.com', password: 'password123', role: 'client' },
    { name: 'Evan Wright', email: 'evan@test.com', password: 'password123', role: 'client' }
];

const professionals = [
    {
        name: 'Dr. Gregory House',
        email: 'house@test.com',
        password: 'password123',
        role: 'professional',
        profile: {
            category: 'Doctor',
            location: 'Princeton, NJ',
            about: 'Specialist in diagnostic medicine. I don\'t treat patients, I treat diseases.',
            appointment_duration: 60
        }
    },
    {
        name: 'Saul Goodman',
        email: 'saul@test.com',
        password: 'password123',
        role: 'professional',
        profile: {
            category: 'Lawyer',
            location: 'Albuquerque, NM',
            about: 'Better Call Saul! Criminal lawyer.',
            appointment_duration: 45
        }
    },
    {
        name: 'Gordon Ramsay',
        email: 'gordon@test.com',
        password: 'password123',
        role: 'professional',
        profile: {
            category: 'Chef',
            location: 'London, UK',
            about: 'World renowned chef. Expect perfection.',
            appointment_duration: 120
        }
    }
];

async function registerUser(user) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        console.log(`✅ Registered ${user.role}: ${user.name}`);
        return data;
    } catch (error) {
        console.log(`⚠️  Skipping ${user.name}: ${error.message}`);
        // Try login if registration fails (maybe already exists)
        return loginUser(user);
    }
}

async function loginUser(user) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: user.email,
            password: user.password
        })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data; // returns { token, user }
}

async function createProfessionalProfile(token, profile) {
    try {
        const response = await fetch(`${API_URL}/professionals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profile)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Profile creation failed');
        console.log(`✅ Created profile for: ${profile.category}`);
        return data;
    } catch (error) {
        console.log(`⚠️  Profile creation skipped: ${error.message}`);
    }
}

async function createAppointment(clientToken, profId, date, time, purpose) {
    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${clientToken}`
            },
            body: JSON.stringify({
                professionalId: profId,
                date,
                time,
                purpose
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Booking failed');
        console.log(`✅ Booked appointment on ${date} at ${time}`);
        return data;
    } catch (error) {
        console.log(`❌ Booking failed: ${error.message}`);
    }
}

async function main() {
    console.log('🚀 Starting data population via API...\n');

    const clientTokens = [];
    const profIds = [];

    // 1. Register Clients
    console.log('--- Registering Clients ---');
    for (const client of clients) {
        const auth = await registerUser(client);
        if (auth && auth.token) {
            clientTokens.push(auth.token);
        }
    }

    // 2. Register Professionals and Create Profiles
    console.log('\n--- Registering Professionals ---');
    for (const prof of professionals) {
        const auth = await registerUser(prof);
        if (auth && auth.token) {
            // Create profile
            const profile = await createProfessionalProfile(auth.token, prof.profile);
            // If profile creation returns the professional object, get ID. 
            // If it fails (already exists), we need to fetch the professional ID.
            // Let's try to fetch the professional ID if we can't get it from creation.

            // Actually, let's just fetch the professional list to get IDs
        }
    }

    // 3. Fetch all professionals to get IDs
    console.log('\n--- Fetching Professional IDs ---');
    // We can use the public endpoint
    const profResponse = await fetch(`${API_URL}/professionals`);
    const profData = await profResponse.json();
    const availableProfs = profData.data || [];

    if (availableProfs.length === 0) {
        console.log('❌ No professionals found to book with.');
        return;
    }

    console.log(`Found ${availableProfs.length} professionals.`);

    // 4. Create Appointments
    console.log('\n--- Creating Appointments ---');

    const purposes = [
        'Initial Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Special Request'
    ];

    const dates = ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28'];
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    // Randomly assign appointments
    for (let i = 0; i < 10; i++) {
        const clientToken = clientTokens[Math.floor(Math.random() * clientTokens.length)];
        const prof = availableProfs[Math.floor(Math.random() * availableProfs.length)];
        const date = dates[Math.floor(Math.random() * dates.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const purpose = purposes[Math.floor(Math.random() * purposes.length)];

        await createAppointment(clientToken, prof.id, date, time, purpose);
    }

    console.log('\n✅ Data population complete!');
}

main().catch(console.error);

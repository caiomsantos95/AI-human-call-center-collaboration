// Sample data arrays
let activeCalls = [
    // Initial Active Calls
    {
        callId: 'C001',
        customer: 'John Doe',
        intent: 'Billing Issue',
        riskScore: 20,
        status: 'Active',
        decisionTrail: [
            'AI greeted the customer.',
            'Customer inquired about billing discrepancy.',
            'AI verified account details.',
            'AI identified overcharge due to system error.',
            'AI applied necessary credits to account.',
            'AI informed customer of the correction.',
            'Customer expressed satisfaction.'
        ],
        resolutionSummary: '',
        handledBy: '',
        needsHelp: false
    },
    {
        callId: 'C002',
        customer: 'Jane Smith',
        intent: 'Technical Support',
        riskScore: 65,
        status: 'Active',
        decisionTrail: [
            'AI greeted the customer.',
            'Customer reported connectivity issues.',
            'AI performed remote diagnostics.',
            'Issue not resolved; AI requests human assistance.'
        ],
        resolutionSummary: '',
        handledBy: '',
        needsHelp: true // AI agent requests help
    },
    {
        callId: 'C003',
        customer: 'Bob Johnson',
        intent: 'Service Cancellation',
        riskScore: 85,
        status: 'Active',
        decisionTrail: [
            'AI greeted the customer.',
            'Customer very upset and requested cancellation.',
            'AI attempted retention offers.',
            'Customer insisted; AI unable to proceed.',
            'Immediate human intervention needed.'
        ],
        resolutionSummary: '',
        handledBy: '',
        needsHelp: false
    },
    // ... (other initial active calls)
];

let concludedCalls = [
    // Initial Concluded Calls
    {
        callId: 'C006',
        customer: 'Maria Garcia',
        intent: 'Order Cancellation',
        riskScore: 40,
        status: 'Concluded',
        decisionTrail: [
            'AI greeted the customer.',
            'Customer requested to cancel an order.',
            'AI verified customer identity using security questions.',
            'AI retrieved order details: Order #12345.',
            'AI confirmed cancellation policy compliance.',
            'AI processed the cancellation request.',
            'AI initiated refund to customer\'s original payment method.',
            'AI provided confirmation number: CN67890.',
            'AI asked if further assistance was needed.',
            'Customer expressed satisfaction and ended the call.'
        ],
        resolutionSummary: 'Order cancelled, refund processed.',
        handledBy: 'AI Agent',
        needsHelp: false
    },
    {
        callId: 'C007',
        customer: 'James Martinez',
        intent: 'Technical Issue',
        riskScore: 70,
        status: 'Concluded',
        decisionTrail: [
            'AI greeted the customer.',
            'Customer reported device malfunction.',
            'AI guided customer through basic troubleshooting.',
            'Issue persisted; human agent intervened.',
            'Human agent resolved complex technical issue.',
            'Customer thanked the agent and ended the call.'
        ],
        resolutionSummary: 'Technical issue resolved by human agent.',
        handledBy: 'Lisa Thompson',
        needsHelp: false
    },
    // ... (other concluded calls with detailed decisionTrail)
];

// Variables for simulation control
let simulationDuration = 15; // in simulated minutes (seconds)
let simulationTimeElapsed = 0; // in seconds

// Function to load calls into the tables
function loadCalls() {
    const activeCallsTableBody = document.getElementById('activeCallsTableBody');
    const concludedCallsTableBody = document.getElementById('concludedCallsTableBody');
    const kpiActiveCalls = document.getElementById('kpiActiveCalls');
    const kpiConcludedCalls = document.getElementById('kpiConcludedCalls');
    const kpiAverageRisk = document.getElementById('kpiAverageRisk');
    const kpiTotalEscalations = document.getElementById('kpiTotalEscalations');

    let activeCallsCount = activeCalls.length;
    let concludedCallsCount = concludedCalls.length;
    let totalRiskScore = 0;
    let totalCalls = activeCallsCount + concludedCallsCount;
    let totalEscalations = 0;

    activeCallsTableBody.innerHTML = ''; // Clear existing content
    concludedCallsTableBody.innerHTML = '';

    // Process Active Calls
    activeCalls.forEach(call => {
        const row = document.createElement('tr');
        // Set row class based on risk score
        if (call.riskScore < 40) {
            row.classList.add('low-risk');
        } else if (call.riskScore < 70) {
            row.classList.add('medium-risk');
        } else {
            row.classList.add('high-risk');
        }

        totalRiskScore += call.riskScore;

        // Rotating symbol for active calls
        const symbolCell = document.createElement('td');
        symbolCell.classList.add('symbol-cell');
        symbolCell.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/000000/phone.png" class="rotating-symbol" alt="Active Call">';
        row.appendChild(symbolCell);

        // Other cells
        row.innerHTML += `
            <td>${call.callId}</td>
            <td>${call.customer}</td>
            <td>${call.intent}</td>
            <td>${call.riskScore}</td>
            <td>${call.status}</td>
        `;

        // Action cell
        const actionCell = document.createElement('td');
        actionCell.classList.add('action-cell');

        if (call.needsHelp) {
            const assistButton = document.createElement('button');
            assistButton.classList.add('action-button');
            assistButton.innerText = 'Assist';
            assistButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent row click event
                assistCall(call);
            });
            actionCell.appendChild(assistButton);
        } else if (call.riskScore >= 70) {
            const interveneButton = document.createElement('button');
            interveneButton.classList.add('action-button');
            interveneButton.innerText = 'Intervene';
            interveneButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent row click event
                interveneInCall(call);
            });
            actionCell.appendChild(interveneButton);
        } else {
            actionCell.innerText = 'N/A';
        }

        row.appendChild(actionCell);

        // Add click event to open modal with call details
        row.addEventListener('click', () => openModal(call));

        activeCallsTableBody.appendChild(row);
    });

    // Process Concluded Calls
    concludedCalls.forEach(call => {
        const row = document.createElement('tr');
        // Set row class based on risk score
        if (call.riskScore < 40) {
            row.classList.add('low-risk');
        } else if (call.riskScore < 70) {
            row.classList.add('medium-risk');
        } else {
            row.classList.add('high-risk');
        }

        totalRiskScore += call.riskScore;

        // Create row content
        row.innerHTML = `
            <td>${call.callId}</td>
            <td>${call.customer}</td>
            <td>${call.intent}</td>
            <td>${call.riskScore}</td>
            <td>${call.resolutionSummary}</td>
            <td>${call.handledBy}</td>
            <td>${call.status}</td>
        `;

        // Check if the call was escalated
        if (call.handledBy && call.handledBy !== 'AI Agent') {
            totalEscalations++;
        }

        // Add click event to open modal with call details
        row.addEventListener('click', () => openModal(call));

        concludedCallsTableBody.appendChild(row);
    });

    // Update KPIs
    kpiActiveCalls.innerText = activeCalls.length;
    kpiConcludedCalls.innerText = concludedCalls.length;
    kpiAverageRisk.innerText = (totalRiskScore / totalCalls).toFixed(2);
    kpiTotalEscalations.innerText = totalEscalations;
}

// Function to open modal with call details
function openModal(call) {
    const modal = document.getElementById('callModal');
    modal.style.display = 'block';

    document.getElementById('modalCallId').innerText = call.callId;
    document.getElementById('modalCustomer').innerText = call.customer;
    document.getElementById('modalIntent').innerText = call.intent;
    document.getElementById('modalRiskScore').innerText = call.riskScore;
    document.getElementById('modalStatus').innerText = call.status;
    document.getElementById('modalHandledBy').innerText = call.handledBy || 'N/A';
    document.getElementById('modalResolutionSummary').innerText = call.resolutionSummary || 'N/A';

    const decisionTrail = document.getElementById('modalDecisionTrail');
    decisionTrail.innerHTML = ''; // Clear existing content

    call.decisionTrail.forEach((step, index) => {
        const li = document.createElement('li');
        li.innerText = step;
        decisionTrail.appendChild(li);
    });

    // Close modal when clicking on the close button
    document.getElementById('closeModal').onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking on the return button
    document.getElementById('modalReturnButton').onclick = function() {
        modal.style.display = 'none';
    };
}

// Function to simulate intervening in a call
function interveneInCall(call) {
    const interveneModal = document.getElementById('interveneModal');
    interveneModal.style.display = 'block';
    document.getElementById('interveneCallId').innerText = call.callId;

    // Close modal when clicking on the return button
    document.getElementById('interveneReturnButton').onclick = function() {
        interveneModal.style.display = 'none';
    };

    // Simulate connecting to the call
    setTimeout(() => {
        // Close the intervene modal after connecting
        interveneModal.style.display = 'none';
        alert(`You have joined Call ID: ${call.callId}`);
        // Open the chatbot modal with summary
        openChatbot(call, 'intervene');
    }, 3000); // Simulate a 3-second connection time
}

// Function to assist AI agent in a call
function assistCall(call) {
    // Open the chatbot modal
    openChatbot(call, 'assist');
}

// Function to open the chatbot modal
function openChatbot(call, type) {
    const chatbotModal = document.getElementById('chatbotModal');
    chatbotModal.style.display = 'block';

    const chatbotHeader = document.getElementById('chatbotHeader');
    const chatbotMessages = document.getElementById('chatbotMessages');

    chatbotMessages.innerHTML = ''; // Clear previous messages

    if (type === 'assist') {
        chatbotHeader.innerText = `Assisting Call ID: ${call.callId}`;
        // AI agent sends a help request message
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('chatbot-message', 'ai-message');
        aiMessage.innerText = 'Hello, I need assistance with this call. The customer has an unusual request that I am unsure how to handle.';
        chatbotMessages.appendChild(aiMessage);
    } else if (type === 'intervene') {
        chatbotHeader.innerText = `Intervened in Call ID: ${call.callId}`;
        // AI agent provides a summary
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('chatbot-message', 'ai-message');
        aiMessage.innerText = `Summary: ${call.decisionTrail.join(' ')}`;
        chatbotMessages.appendChild(aiMessage);
    }

    // Set up event listener for sending messages
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendButton = document.getElementById('chatbotSendButton');

    chatbotSendButton.onclick = function() {
        const userMessageText = chatbotInput.value.trim();
        if (userMessageText !== '') {
            // Display user's message
            const userMessage = document.createElement('div');
            userMessage.classList.add('chatbot-message', 'user-message');
            userMessage.innerText = userMessageText;
            chatbotMessages.appendChild(userMessage);
            chatbotInput.value = '';

            // Simulate AI agent's response
            setTimeout(() => {
                const aiResponse = document.createElement('div');
                aiResponse.classList.add('chatbot-message', 'ai-message');
                aiResponse.innerText = 'Understood. Thank you for your guidance.';
                chatbotMessages.appendChild(aiResponse);
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    };

    // Close chatbot when clicking on close button
    document.getElementById('chatbotCloseButton').onclick = function() {
        chatbotModal.style.display = 'none';
    };
}

// Helper function to remove a call from active calls
function removeCallFromActive(callId) {
    activeCalls = activeCalls.filter(call => call.callId !== callId);
}

// Simulation functions
function addNewCall() {
    // Create a new call with random data
    const newCallId = 'C' + (Math.floor(Math.random() * 900) + 100); // Random call ID
    const intents = ['Billing Issue', 'Technical Support', 'Service Cancellation', 'Password Reset', 'Account Update', 'Product Inquiry'];
    const customers = ['Chris Evans', 'Natalie Portman', 'Robert Downey', 'Scarlett Johansson', 'Mark Ruffalo', 'Jeremy Renner'];
    const newCall = {
        callId: newCallId,
        customer: customers[Math.floor(Math.random() * customers.length)],
        intent: intents[Math.floor(Math.random() * intents.length)],
        riskScore: Math.floor(Math.random() * 100) + 1,
        status: 'Active',
        decisionTrail: ['AI greeted the customer.'],
        resolutionSummary: '',
        handledBy: '',
        needsHelp: Math.random() < 0.3 // 30% chance the AI needs help
    };
    activeCalls.push(newCall);
    loadCalls();
}

function resolveCall() {
    if (activeCalls.length > 0) {
        // Remove the first active call and conclude it
        const call = activeCalls.shift();
        call.status = 'Concluded';
        call.handledBy = 'AI Agent';
        call.resolutionSummary = 'Issue resolved by AI agent.';
        call.decisionTrail.push('AI resolved the issue successfully.');
        concludedCalls.push(call);
        loadCalls();
    }
}

// Start the simulation
function startSimulation() {
    loadCalls();

    const addCallInterval = setInterval(() => {
        simulationTimeElapsed += 2;
        if (simulationTimeElapsed <= simulationDuration) {
            addNewCall();
        } else {
            clearInterval(addCallInterval);
        }
    }, 2000); // Every 2 seconds (simulated 2 minutes)

    const resolveCallInterval = setInterval(() => {
        simulationTimeElapsed += 5;
        if (simulationTimeElapsed <= simulationDuration) {
            resolveCall();
        } else {
            clearInterval(resolveCallInterval);
        }
    }, 5000); // Every 5 seconds (simulated 5 minutes)

    // Stop the simulation after 15 seconds (simulated 15 minutes)
    setTimeout(() => {
        clearInterval(addCallInterval);
        clearInterval(resolveCallInterval);
    }, simulationDuration * 1000);
}

// Initialize the dashboard and start the simulation
startSimulation();

// Close modals when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('callModal');
    const chatbotModal = document.getElementById('chatbotModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
    if (event.target == chatbotModal) {
        chatbotModal.style.display = 'none';
    }
};

import { useState, useEffect } from 'react';
import axios from 'axios';

const TravelForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    crew_id: '',
    base: '',
    gateway: '',
    preferred_airlines: [],
    seat_pref: '',
    duty_start_time: '',
    pairing_id: '',
    check_in: '',
    loa_status: '',
    class_of_service: '',
    estimated_block_time_hours: '',
    max_reposition_time: ''
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Predefined options
  const airports = ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'SFO', 'SEA', 'MIA', 'DEN', 'BOS'];
  const airlines = ['Delta', 'United', 'American', 'Southwest', 'JetBlue', 'Alaska'];
  const seatPreferences = ['Window', 'Aisle', 'Middle'];
  const classOfService = ['Economy', 'Business', 'First'];
  const loaStatuses = ['Active', 'Inactive'];

  // Demo values for testing
  const demoValues = {
    name: 'John Smith',
    crew_id: 'AL1234',
    base: 'JFK',
    gateway: 'LAX',
    preferred_airlines: ['Delta', 'United'],
    seat_pref: 'Window',
    duty_start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    pairing_id: 'PX123',
    check_in: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString().slice(0, 16),
    loa_status: 'Active',
    class_of_service: 'Business',
    estimated_block_time_hours: '5',
    max_reposition_time: '6'
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      name: 'Name is required',
      crew_id: 'Crew ID is required',
      base: 'Base is required',
      gateway: 'Gateway is required',
      preferred_airlines: 'At least one preferred airline is required',
      seat_pref: 'Seat preference is required',
      duty_start_time: 'Duty start time is required',
      pairing_id: 'Pairing ID is required',
      check_in: 'Check-in time is required',
      loa_status: 'LOA status is required',
      class_of_service: 'Class of service is required'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        errors[field] = message;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };

  // Load demo values
  const loadDemoValues = () => {
    setFormData(demoValues);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError(null);
    setResponse(null);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/recommend-travel", {
        ...formData,
        travel_type: "gateway",
        schedule: {
          pairing_id: formData.pairing_id,
          check_in: formData.check_in
        },
        cba_rules: {
          max_reposition_time: parseInt(formData.max_reposition_time)
        }
      });

      setResponse(response.data);
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.response) {
        switch (error.response.status) {
          case 422:
            errorMessage = "Unable to process travel request. Please double-check your entries.";
            break;
          case 500:
            errorMessage = "Server error. Please try again shortly.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Progress steps
  const steps = [
    { id: 1, title: 'Pilot Information' },
    { id: 2, title: 'Travel Details' },
    { id: 3, title: 'Contract Information' }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-2 text-sm font-medium">{step.title}</div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-muted mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Pilot Travel Request</h1>
            <p className="text-muted-foreground">Enter your travel details for recommendations</p>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Processing Your Request</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please wait while we process your travel request...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Pilot Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Pilot Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.name ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-destructive">{validationErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Crew ID</label>
                    <input
                      type="text"
                      name="crew_id"
                      value={formData.crew_id}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.crew_id ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    />
                    {validationErrors.crew_id && (
                      <p className="text-sm text-destructive">{validationErrors.crew_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Base</label>
                    <select
                      name="base"
                      value={formData.base}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.base ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    >
                      <option value="">Select base</option>
                      {airports.map(airport => (
                        <option key={airport} value={airport}>{airport}</option>
                      ))}
                    </select>
                    {validationErrors.base && (
                      <p className="text-sm text-destructive">{validationErrors.base}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Gateway</label>
                    <select
                      name="gateway"
                      value={formData.gateway}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.gateway ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    >
                      <option value="">Select gateway</option>
                      {airports.map(airport => (
                        <option key={airport} value={airport}>{airport}</option>
                      ))}
                    </select>
                    {validationErrors.gateway && (
                      <p className="text-sm text-destructive">{validationErrors.gateway}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Travel Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Travel Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Duty Start Time</label>
                    <input
                      type="datetime-local"
                      name="duty_start_time"
                      value={formData.duty_start_time}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.duty_start_time ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    />
                    {validationErrors.duty_start_time && (
                      <p className="text-sm text-destructive">{validationErrors.duty_start_time}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Pairing ID</label>
                    <input
                      type="text"
                      name="pairing_id"
                      value={formData.pairing_id}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.pairing_id ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    />
                    {validationErrors.pairing_id && (
                      <p className="text-sm text-destructive">{validationErrors.pairing_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Preferred Airlines</label>
                    <select
                      name="preferred_airlines"
                      multiple
                      value={formData.preferred_airlines}
                      onChange={handleMultiSelect}
                      className={`flex h-24 w-full rounded-md border ${
                        validationErrors.preferred_airlines ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    >
                      {airlines.map(airline => (
                        <option key={airline} value={airline}>{airline}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple airlines</p>
                    {validationErrors.preferred_airlines && (
                      <p className="text-sm text-destructive">{validationErrors.preferred_airlines}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Seat Preference</label>
                    <select
                      name="seat_pref"
                      value={formData.seat_pref}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.seat_pref ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    >
                      <option value="">Select preference</option>
                      {seatPreferences.map(pref => (
                        <option key={pref} value={pref}>{pref}</option>
                      ))}
                    </select>
                    {validationErrors.seat_pref && (
                      <p className="text-sm text-destructive">{validationErrors.seat_pref}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contract Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Contract Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">LOA Status</label>
                    <select
                      name="loa_status"
                      value={formData.loa_status}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.loa_status ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    >
                      <option value="">Select status</option>
                      {loaStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    {validationErrors.loa_status && (
                      <p className="text-sm text-destructive">{validationErrors.loa_status}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Class of Service</label>
                    <select
                      name="class_of_service"
                      value={formData.class_of_service}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        validationErrors.class_of_service ? 'border-destructive' : 'border-input'
                      } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      required
                    >
                      <option value="">Select class</option>
                      {classOfService.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                    {validationErrors.class_of_service && (
                      <p className="text-sm text-destructive">{validationErrors.class_of_service}</p>
                    )}
                  </div>

                  {/* Advanced Options */}
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-sm text-primary hover:underline"
                    >
                      {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </button>
                  </div>

                  {showAdvanced && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Estimated Block Time (hours)</label>
                        <input
                          type="number"
                          name="estimated_block_time_hours"
                          value={formData.estimated_block_time_hours}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Max Reposition Time (hours)</label>
                        <input
                          type="number"
                          name="max_reposition_time"
                          value={formData.max_reposition_time}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          min="1"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Navigation and Submit Buttons */}
            <div className="fixed bottom-0 left-0 right-0 md:relative bg-background border-t md:border-t-0 p-4 md:p-0">
              <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Next
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={loadDemoValues}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Load Demo
                  </button>
                  {currentStep === 3 && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : 'Submit Request'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>

          {error && (
            <div className="rounded-md bg-destructive/15 p-4 text-destructive border border-destructive/50">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-medium">Unable to Process Request</h3>
                  <p className="text-sm mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-destructive hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {response && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="font-medium">Travel Recommendation Submitted Successfully</h3>
              </div>
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Action</p>
                    <p className="font-medium">{response.action}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="font-medium">{response.reason}</p>
                  </div>
                </div>
                {response.minutes_to_report && (
                  <div>
                    <p className="text-sm text-muted-foreground">Minutes to Report</p>
                    <p className="font-medium">{response.minutes_to_report}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelForm; 
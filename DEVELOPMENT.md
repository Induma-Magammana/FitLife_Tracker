# FitLife Tracker - Development Guide

## 🎓 For Developers and Learners

This guide will help you understand the codebase structure, make modifications, and add new features.

## 📚 Learning Path

### Beginners
1. **Understand React Native Basics**
   - Components and Props
   - State and Hooks (useState, useEffect)
   - Styling with StyleSheet
   
2. **Learn Navigation**
   - Stack Navigator
   - Tab Navigator
   - Navigation props and params

3. **State Management**
   - Redux basics
   - Redux Toolkit
   - Dispatch and Selectors

### Intermediate
1. **Form Handling**
   - Formik setup
   - Yup validation
   - Custom validation rules

2. **API Integration**
   - Axios requests
   - Error handling
   - Loading states

3. **Data Persistence**
   - AsyncStorage
   - Reading and writing data
   - Data serialization

## 🛠️ Common Development Tasks

### 1. Adding a New Screen

**Step 1**: Create the screen component
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightTheme } from '../constants/theme';

export const NewScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  title: {
    fontSize: 24,
    color: lightTheme.text,
  },
});
```

**Step 2**: Add to navigator
```typescript
// src/navigation/MainNavigator.tsx
import { NewScreen } from '../screens/NewScreen';

// Inside Tab.Navigator or Stack.Navigator
<Tab.Screen 
  name="New" 
  component={NewScreen} 
  options={{
    tabBarLabel: 'New',
    tabBarIcon: ({ color }) => <TabIcon icon="✨" color={color} />,
  }}
/>
```

### 2. Adding a New Redux Slice

**Step 1**: Create the slice
```typescript
// src/store/slices/newSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewState {
  data: any[];
  loading: boolean;
}

const initialState: NewState = {
  data: [],
  loading: false,
};

const newSlice = createSlice({
  name: 'new',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = newSlice.actions;
export default newSlice.reducer;
```

**Step 2**: Add to store
```typescript
// src/store/index.ts
import newReducer from './slices/newSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    favourites: favouritesReducer,
    new: newReducer, // Add this
  },
});
```

**Step 3**: Use in components
```typescript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setData } from '../store/slices/newSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.new.data);
  
  // Use dispatch to update
  dispatch(setData([...]));
};
```

### 3. Adding Form Validation

**Step 1**: Define Yup schema
```typescript
import * as Yup from 'yup';

const MyFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too short')
    .required('Name is required'),
  age: Yup.number()
    .min(18, 'Must be 18+')
    .required('Age is required'),
});
```

**Step 2**: Use with Formik
```typescript
import { Formik } from 'formik';

<Formik
  initialValues={{ name: '', age: '' }}
  validationSchema={MyFormSchema}
  onSubmit={(values) => {
    console.log(values);
  }}
>
  {({ handleChange, values, errors }) => (
    <View>
      <TextInput
        value={values.name}
        onChangeText={handleChange('name')}
      />
      {errors.name && <Text>{errors.name}</Text>}
    </View>
  )}
</Formik>
```

### 4. Integrating a New API

**Step 1**: Add API function
```typescript
// src/services/apiService.ts
export const apiService = {
  // Existing methods...
  
  async getNewData() {
    try {
      const response = await axios.get('https://api.example.com/data');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};
```

**Step 2**: Use in component
```typescript
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await apiService.getNewData();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
};
```

### 5. Adding AsyncStorage Functionality

**Step 1**: Add storage method
```typescript
// src/services/storageService.ts
export const StorageService = {
  // Existing methods...
  
  async saveNewData(data: any): Promise<void> {
    await AsyncStorage.setItem('@new_data', JSON.stringify(data));
  },
  
  async getNewData(): Promise<any> {
    const data = await AsyncStorage.getItem('@new_data');
    return data ? JSON.parse(data) : null;
  },
};
```

**Step 2**: Use in component or Redux
```typescript
// Save data
await StorageService.saveNewData(myData);

// Load data
const data = await StorageService.getNewData();
```

## 🎨 Styling Guidelines

### Using the Theme
```typescript
import { lightTheme } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightTheme.background,
  },
  text: {
    color: lightTheme.text,
  },
  button: {
    backgroundColor: lightTheme.primary,
  },
});
```

### Common Style Patterns
```typescript
// Card style
card: {
  backgroundColor: lightTheme.cardBackground,
  borderRadius: 12,
  padding: 16,
  shadowColor: lightTheme.shadowColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}

// Button style
button: {
  backgroundColor: lightTheme.primary,
  borderRadius: 8,
  padding: 16,
  alignItems: 'center',
}

// Input style
input: {
  backgroundColor: lightTheme.surface,
  borderRadius: 8,
  padding: 16,
  borderWidth: 1,
  borderColor: lightTheme.border,
}
```

## 🐛 Debugging Tips

### Console Logging
```typescript
// View in terminal or browser console
console.log('Data:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### Redux DevTools
```typescript
// Already configured in store/index.ts
// Use React Native Debugger for viewing state
```

### Network Debugging
```typescript
// Check API calls in browser network tab
// Or use React Native Debugger
```

### AsyncStorage Debugging
```typescript
// View all stored data
const getAllKeys = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('Storage Keys:', keys);
};

// View specific item
const viewData = async () => {
  const data = await AsyncStorage.getItem('@auth_token');
  console.log('Token:', data);
};
```

## 🧪 Testing (Future Implementation)

### Unit Tests with Jest
```typescript
// Example test structure
describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeDefined();
  });
  
  it('handles button press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## 📝 Code Style Guidelines

### Naming Conventions
- **Components**: PascalCase (e.g., `MyComponent`)
- **Files**: PascalCase for components (e.g., `HomeScreen.tsx`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_KEY`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `User` or `IUser`)

### File Organization
```
Screen/Feature File:
1. Imports
2. Type definitions
3. Component definition
4. Helper functions
5. Styles
```

### Comment Guidelines
```typescript
// Single line comment for brief explanations

/**
 * Multi-line comment for complex logic
 * Explains what the function does
 * @param data - Description of parameter
 * @returns Description of return value
 */
```

## 🚀 Building New Features

### Feature Development Workflow

1. **Plan**
   - Define feature requirements
   - Design UI/UX mockups
   - Identify necessary components

2. **Setup**
   - Create new branch: `feature/feature-name`
   - Create necessary files
   - Update navigation if needed

3. **Implement**
   - Build UI components
   - Add business logic
   - Integrate with Redux
   - Connect to APIs

4. **Style**
   - Apply consistent styling
   - Use theme colors
   - Ensure responsive design

5. **Test**
   - Manual testing
   - Edge case testing
   - Different screen sizes

6. **Document**
   - Add code comments
   - Update README if needed
   - Document API changes

7. **Commit**
   - Write clear commit messages
   - Follow commit conventions
   - Push to remote branch

### Example: Adding Search Feature

**1. Create Search Component**
```typescript
// src/components/SearchBar.tsx
export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  return (
    <TextInput
      value={query}
      onChangeText={(text) => {
        setQuery(text);
        onSearch(text);
      }}
      placeholder="Search exercises..."
    />
  );
};
```

**2. Add to Home Screen**
```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredExercises = exercises.filter(ex =>
  ex.name.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
  <View>
    <SearchBar onSearch={setSearchQuery} />
    <FlatList data={filteredExercises} ... />
  </View>
);
```

## 🔧 Troubleshooting Common Issues

### Issue: Component Not Re-rendering
**Solution**: Check if state is being updated correctly
```typescript
// Wrong
state.data = newData;

// Correct
setState({ ...state, data: newData });
```

### Issue: AsyncStorage Not Working
**Solution**: Ensure async/await is used properly
```typescript
// Wrong
const data = AsyncStorage.getItem('@key');

// Correct
const data = await AsyncStorage.getItem('@key');
```

### Issue: Navigation Not Working
**Solution**: Check navigation prop and screen names
```typescript
// Ensure screen is registered in navigator
navigation.navigate('ScreenName');
```

## 📦 Adding New Dependencies

```powershell
# Install package
npm install package-name

# Install with type definitions
npm install package-name
npm install --save-dev @types/package-name

# Update package.json automatically
# Expo will handle native dependencies
```

## 🎯 Next Steps for Learning

1. **Implement Dark Mode**
   - Create dark theme object
   - Add theme context
   - Implement theme toggle

2. **Add Search Functionality**
   - Create search component
   - Filter exercises
   - Debounce search input

3. **Implement Workout Tracking**
   - Create workout model
   - Add workout logging
   - Display workout history

4. **Add Advanced Filtering**
   - Filter by muscle group
   - Filter by difficulty
   - Multi-select filters

5. **Create Custom Workout Plans**
   - Design workout plan interface
   - Save custom plans
   - Schedule workouts

## 📚 Resources

### Documentation
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- Redux Toolkit: https://redux-toolkit.js.org/
- Formik: https://formik.org/
- Yup: https://github.com/jquense/yup

### Learning Platforms
- React Native School
- Udemy React Native Courses
- FreeCodeCamp
- YouTube Tutorials

### Community
- React Native Discord
- Stack Overflow
- GitHub Discussions
- Reddit r/reactnative

---

Happy Coding! 🎉 Keep learning and building amazing features!

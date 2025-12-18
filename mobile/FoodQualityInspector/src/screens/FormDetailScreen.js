import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFormById, submitReport } from '../services/formService';

const FormDetailScreen = ({ route, navigation }) => {
  const { formId } = route.params;
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = async () => {
    try {
      const result = await getFormById(formId);
      if (result.success) {
        setForm(result.data);
        // Initialize form data with empty values
        const initialData = {};
        result.data.fields.forEach(field => {
          initialData[field.id] = '';
        });
        setFormData(initialData);
      } else {
        Alert.alert('Error', result.error);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load form');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const missingFields = form.fields.filter(field => 
      field.required && (!formData[field.id] || formData[field.id].trim() === '')
    );
    
    if (missingFields.length > 0) {
      const missingNames = missingFields.map(f => f.label).join(', ');
      Alert.alert('Missing Required Fields', `Please fill in: ${missingNames}`);
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare submission data
      const reportData = {
        formId: form.id,
        fields: form.fields.map(field => ({
          fieldId: field.id,
          value: formData[field.id] || ''
        }))
      };

      const result = await submitReport(reportData);
      
      if (result.success) {
        Alert.alert(
          'Success', 
          'Report submitted successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    switch (field.fieldType) {
      case 'TEXT':
        return (
          <TextInput
            style={styles.textInput}
            placeholder={field.label}
            value={formData[field.id] || ''}
            onChangeText={(value) => handleInputChange(field.id, value)}
          />
        );
        
      case 'TEXTAREA':
        return (
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={field.label}
            value={formData[field.id] || ''}
            onChangeText={(value) => handleInputChange(field.id, value)}
            multiline
            numberOfLines={4}
          />
        );
        
      case 'NUMBER':
        return (
          <TextInput
            style={styles.textInput}
            placeholder={field.label}
            value={formData[field.id] || ''}
            onChangeText={(value) => handleInputChange(field.id, value)}
            keyboardType="numeric"
          />
        );
        
      case 'SELECT':
        return (
          <View style={styles.pickerContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Picker
              selectedValue={formData[field.id] || ''}
              style={styles.picker}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
              <Picker.Item label="Select an option" value="" />
              {field.options && field.options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );
        
      case 'CHECKBOX':
        return (
          <View style={styles.checkboxContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Switch
              value={!!formData[field.id]}
              onValueChange={(value) => handleInputChange(field.id, value.toString())}
            />
          </View>
        );
        
      default:
        return (
          <TextInput
            style={styles.textInput}
            placeholder={field.label}
            value={formData[field.id] || ''}
            onChangeText={(value) => handleInputChange(field.id, value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading form...</Text>
      </View>
    );
  }

  if (!form) {
    return (
      <View style={styles.errorContainer}>
        <Text>Form not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{form.title}</Text>
        {form.description ? (
          <Text style={styles.description}>{form.description}</Text>
        ) : null}
      </View>
      
      <View style={styles.formContainer}>
        {form.fields.map(field => (
          <View key={field.id} style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              {field.required && <Text style={styles.required}>*</Text>}
            </View>
            {renderField(field)}
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[styles.submitButton, submitting && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    padding: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: 'red',
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormDetailScreen;
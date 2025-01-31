/* eslint-disable prettier/prettier */
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View, TouchableOpacity, Button, FlatList, StyleSheet  } from 'react-native'
import { useClerk } from '@clerk/clerk-react'
import * as Linking from 'expo-linking'
import { SafeAreaView } from 'react-native-safe-area-context'
import { greek_trips } from '@/constants/testData';
import DraggableFlatList, { NestableScrollContainer, NestableDraggableFlatList, RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import TripCard from '@/components/TripCard'
import { Header } from 'react-native/Libraries/NewAppScreen'
import { useState } from 'react'
import CustomDragList from '@/components/CustomDragList'

export default function Page() {
    const { user } = useUser();
    const trips = greek_trips;
    return (
      <SafeAreaView>
        <CustomDragList data={trips} className='px-5 min-h-full'/>

      </SafeAreaView>
    );
}